import { effect, stop } from "../effect";
import { reactive } from "../reactive";
describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 27,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(28);

    //update
    user.age++;
    expect(nextAge).toBe(29);
  });

  it("should return runner when call effect", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "runner";
    });

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("runner");
  });

  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });

    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo = 2;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    //effect should be stopped
    obj.prop = 3;
    expect(dummy).toBe(2);

    //stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const onStop = jest.fn();
    let runner = effect(
      () => {
        dummy = obj.prop;
      },
      {
        onStop,
      }
    );
    stop(runner);
    obj.prop = 2;
    expect(dummy).toBe(1);
    // effect should be stopped
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});
