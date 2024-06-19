import { hasChanged } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";

export class RefImpl {
  private _value: any;
  public deps;

  constructor(value) {
    this._value = value;
    this.deps = new Set();
  }

  get value() {
    if (isTracking()) {
      trackEffects(this.deps);
    }
    return this._value;
  }

  set value(newVal) {
    if (hasChanged(newVal, this._value)) {
      this._value = newVal;
      triggerEffects(this.deps);
    }
  }
}

export function ref(value) {
  return new RefImpl(value);
}
