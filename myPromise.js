"use strict";
class myPromise {
  value;
  state = "pending";
  constructor(callbackFn) {
    try {
      this.value = callbackFn();
      this.state = "fulfilled";
    } catch (e) {
      this.value = e;
      this.state = "rejected";
    }

    return this;
  }

  then(callbackFn) {
    if (this.state === "fulfilled") {
      callbackFn(this.value);
    }
    return this;
  }

  catch(callbackFn) {
    if (this.state === "rejected") {
      callbackFn(this.value);
    }
    return this;
  }

  finally(callbackFn) {
    callbackFn(this.value);
    return this;
  }
}
