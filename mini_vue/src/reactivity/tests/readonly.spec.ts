import { isReadonly, readonly } from "../reactive";
describe("readonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const observed = readonly(original);

    expect(observed).not.toBe(original);
    expect(isReadonly(observed)).toBe(true);
    expect(isReadonly(observed.bar)).toBe(true);
    expect(isReadonly(original.bar)).toBe(false);
    expect(isReadonly(original)).toBe(false);
    expect(observed.foo).toBe(1);
  });

  it("warn the call set", () => {
    console.warn = jest.fn();

    const user = readonly({
      age: 11,
    });
    user.age = 12;
    expect(user.age).toBe(11);
    expect(console.warn).toBeCalled();
  });
});
