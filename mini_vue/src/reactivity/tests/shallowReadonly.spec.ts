import { isReadonly, isShallowReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly", () => {
  it("should not make non-reactive propertiews reactive", () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
    expect(isShallowReadonly(props)).toBe(true);
  });

  it("warn the call set", () => {
    console.warn = jest.fn();

    const user = shallowReadonly({
      age: 11,
    });
    user.age = 12;
    expect(user.age).toBe(11);
    expect(console.warn).toBeCalled();
  });
});
