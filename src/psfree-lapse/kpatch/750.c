/* Copyright (C) 2024-2025 anonymous

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

// 7.50, 7.51, 7.55

#include "types.h"
#include "utils.h"

struct kexec_args {
    u64 entry;
    u64 arg1;
    u64 arg2;
    u64 arg3;
    u64 arg4;
    u64 arg5;
};

static inline void restore(void *kbase, struct kexec_args *uap);
static inline void patch_aio(void *kbase);
static inline void do_patch(void *kbase);

__attribute__((section (".text.start")))
int kpatch(void *td, struct kexec_args *uap) {
    const u64 xfast_syscall_off = 0x1c0;
    void * const kbase = (void *)rdmsr(0xc0000082) - xfast_syscall_off;

    do_patch(kbase);
    patch_aio(kbase);
    restore(kbase, uap);

    return 0;
}

__attribute__((always_inline))
static inline void restore(void *kbase, struct kexec_args *uap) {
    u8 *pipe = uap->arg1;
    u8 *pipebuf = uap->arg2;
    for (int i = 0; i < 0x18; i++) {
        pipe[i] = pipebuf[i];
    }
    u64 *pktinfo_field = uap->arg3;
    *pktinfo_field = 0;
    u64 *pktinfo_field2 = uap->arg4;
    *pktinfo_field2 = 0;

    u64 *sysent_661_save = uap->arg5;
    for (int i = 0; i < 0x30; i += 8) {
        write64(kbase, 0x1129f30 + i, sysent_661_save[i / 8]);
    }
}

__attribute__((always_inline))
static inline void patch_aio(void *kbase) {
    disable_cr0_wp();

    const u64 aio_off = 0xb20f5;

    // patch = {0xeb, 0x03}
    write16(kbase, aio_off, 0x03eb);

    // offset = 0x10e
    // patch = {0xe9, 0xf2, 0xfe, 0xff, 0xff}
    write32(kbase, aio_off + 0x10e, 0xfffef2e9);
    write8(kbase, aio_off + 0x112, 0xff);

    // offset = 0x5
    // patch = {0x41, 0x83, 0xbe, 0xa0, 0x04, 0x00, 0x00, 0x00}
    write64(kbase, aio_off + 0x5, 0x00000004a0be8341);

    // offset = 0x13
    // patch = {0x49, 0x8b, 0x86, 0xd0, 0x04, 0x00, 0x00}
    write32(kbase, aio_off + 0x13, 0xd0868b49);
    write16(kbase, aio_off + 0x17, 0x0004);
    write8(kbase, aio_off + 0x19, 0x00);

    // offset = 0x20
    // patch = {0x49, 0x8b, 0xb6, 0xb0, 0x04, 0x00, 0x00}
    write32(kbase, aio_off + 0x20, 0xb0b68b49);
    write16(kbase, aio_off + 0x24, 0x0004);
    write8(kbase, aio_off + 0x26, 0x00);

    // offset = 0x38
    // patch = {0x49, 0x8b, 0x86, 0x40, 0x05, 0x00, 0x00}
    write32(kbase, aio_off + 0x38, 0x40868b49);
    write16(kbase, aio_off + 0x3c, 0x0005);
    write8(kbase, aio_off + 0x3e, 0x00);

    // offset = 0x45
    // patch = {0x49, 0x8b, 0xb6, 0x20, 0x05, 0x00, 0x00}
    write32(kbase, aio_off + 0x45, 0x20b68b49);
    write16(kbase, aio_off + 0x49, 0x0005);
    write8(kbase, aio_off + 0x4b, 0x00);

    // offset = 0x5d
    // patch = {0x49, 0x8d, 0xbe, 0xc0, 0x00, 0x00, 0x00}
    write32(kbase, aio_off + 0x5d, 0xc0be8d49);
    write16(kbase, aio_off + 0x61, 0x0000);
    write8(kbase, aio_off + 0x63, 0x00);

    // offset = 0x69
    // patch = {0x49, 0x8d, 0xbe, 0xe0, 0x00, 0x00, 0x00}
    write32(kbase, aio_off + 0x69, 0xe0be8d49);
    write16(kbase, aio_off + 0x6d, 0x0000);
    write8(kbase, aio_off + 0x6f, 0x00);

    // offset = 0x7c
    // patch = {0x49, 0x8d, 0xbe, 0x00, 0x01, 0x00, 0x00}
    write32(kbase, aio_off + 0x7c, 0x00be8d49);
    write16(kbase, aio_off + 0x80, 0x0001);
    write8(kbase, aio_off + 0x82, 0x00);

    // offset = 0x88
    // patch = {0x49, 0x8d, 0xbe, 0x20, 0x01, 0x00, 0x00}
    write32(kbase, aio_off + 0x88, 0x20be8d49);
    write16(kbase, aio_off + 0x8c, 0x0001);
    write8(kbase, aio_off + 0x8e, 0x00);

    // offset = 0x99
    // patch = {0x4c, 0x89, 0xf7}
    write16(kbase, aio_off + 0x99, 0x894c);
    write8(kbase, aio_off + 0x9b, 0xf7);

    enable_cr0_wp();
}

__attribute__((always_inline))
static inline void do_patch(void *kbase) {
    disable_cr0_wp();

    // ChendoChap's patches from pOOBs4
    write16(kbase, 0x637394, 0x00eb); // veriPatch
    write8(kbase, 0xadd, 0xeb); // bcopy
    write8(kbase, 0x28f74d, 0xeb); // bzero
    write8(kbase, 0x28f791, 0xeb); // pagezero
    write8(kbase, 0x28f80d, 0xeb); // memcpy
    write8(kbase, 0x28f851, 0xeb); // pagecopy
    write8(kbase, 0x28f9fd, 0xeb); // copyin
    write8(kbase, 0x28fead, 0xeb); // copyinstr
    write8(kbase, 0x28ff7d, 0xeb); // copystr

    // stop sysVeri from causing a delayed panic on suspend
    write16(kbase, 0x637ccf, 0x00eb);

    // patch amd64_syscall() to allow calling syscalls everywhere
    // struct syscall_args sa; // initialized already
    // u64 code = get_u64_at_user_address(td->tf_frame-tf_rip);
    // int is_invalid_syscall = 0
    //
    // // check the calling code if it looks like one of the syscall stubs at a
    // // libkernel library and check if the syscall number correponds to the
    // // proper stub
    // if ((code & 0xff0000000000ffff) != 0x890000000000c0c7
    //     || sa.code != (u32)(code >> 0x10)
    // ) {
    //     // patch this to " = 0" instead
    //     is_invalid_syscall = -1;
    // }
    write32(kbase, 0x490, 0);
    // these code corresponds to the check that ensures that the caller's
    // instruction pointer is inside the libkernel library's memory range
    //
    // // patch the check to always go to the "goto do_syscall;" line
    // void *code = td->td_frame->tf_rip;
    // if (libkernel->start <= code && code < libkernel->end
    //     && is_invalid_syscall == 0
    // ) {
    //     goto do_syscall;
    // }
    //
    // do_syscall:
    //     ...
    //     lea     rsi, [rbp - 0x78]
    //     mov     rdi, rbx
    //     mov     rax, qword [rbp - 0x80]
    //     call    qword [rax + 8] ; error = (sa->callp->sy_call)(td, sa->args)
    //
    // sy_call() is the function that will execute the requested syscall.
    write16(kbase, 0x4c6, 0xe990);
    write16(kbase, 0x4bd, 0x00eb);
    write16(kbase, 0x4b9, 0x00eb);

    // patch sys_setuid() to allow freely changing the effective user ID
    // ; PRIV_CRED_SETUID = 50
    // call priv_check_cred(oldcred, PRIV_CRED_SETUID, 0)
    // test eax, eax
    // je ... ; patch je to jmp
    write8(kbase, 0x37a327, 0xeb);

    // patch vm_map_protect() (called by sys_mprotect()) to allow rwx mappings
    //
    // this check is skipped after the patch
    //
    // if ((new_prot & current->max_protection) != new_prot) {
    //     vm_map_unlock(map);
    //     return (KERN_PROTECTION_FAILURE);
    // }
    write16(kbase, 0x3014c8, 0x04eb);

    // TODO: Description of this patch. patch sys_dynlib_load_prx()
    write16(kbase, 0x451e04, 0xe990);

    // patch sys_dynlib_dlsym() to allow dynamic symbol resolution everywhere
    // call    ...
    // mov     r14, qword [rbp - 0xad0]
    // cmp     eax, 0x4000000
    // jb      ... ; patch jb to jmp
    write16(kbase, 0x4523c4, 0xe990);
    // patch called function to always return 0
    //
    // sys_dynlib_dlsym:
    //     ...
    //     mov     edi, 0x10 ; 16
    //     call    patched_function ; kernel_base + 0x951c0
    //     test    eax, eax
    //     je      ...
    //     mov     rax, qword [rbp - 0xad8]
    //     ...
    // patched_function: ; patch to "xor eax, eax; ret"
    //     push    rbp
    //     mov     rbp, rsp
    //     ...
    write32(kbase, 0x29a30, 0xc3c03148);

    // patch sys_mmap() to allow rwx mappings
    // patch maximum cpu mem protection: 0x33 -> 0x37
    // the ps4 added custom protections for their gpu memory accesses
    // GPU X: 0x8 R: 0x10 W: 0x20
    // that's why you see other bits set
    // ref: https://cturt.github.io/ps4-2.html
    write8(kbase, 0xdb17d, 0x37);
    write8(kbase, 0xdb180, 0x37);

    // overwrite the entry of syscall 11 (unimplemented) in sysent
    //
    // struct args {
    //     u64 rdi;
    //     u64 rsi;
    //     u64 rdx;
    //     u64 rcx;
    //     u64 r8;
    //     u64 r9;
    // };
    //
    // int sys_kexec(struct thread td, struct args *uap) {
    //     asm("jmp qword ptr [rsi]");
    // }
    const u64 sysent_11_off = 0x1122550;
    // .sy_narg = 2
    write32(kbase, sysent_11_off, 2);
    // .sy_call = gadgets['jmp qword ptr [rsi]']
    write64(kbase, sysent_11_off + 8, kbase + 0x1f842);
    // .sy_thrcnt = SY_THR_STATIC
    write32(kbase, sysent_11_off + 0x2c, 1);

    enable_cr0_wp();
}
