"use strict";
class myPromise {
  value;
  state = "pending";
  constructor(callbackFn) {
    function myResolve(value) {
      if (this.state !== "pending") return;

      this.value = value;
      this.state = "fulfilled";
    }

    function myReject(value) {
      if (this.state !== "pending") return;

      this.value = value;
      this.state = "rejected";
    }

    try {
      callbackFn(myResolve, myReject);
    } catch (e) {
      reject(e);
    }
  }

  then(successFn, failFn) {
    if (this.state === "fulfilled") {
      successFn(this.value);
    } else if (this.state === "rejected") {
      failFn(this.value);
    }
    return this;
  }

  catch(failFn) {
    if (this.state === "rejected") {
      this.then(null, failFn);
    }
  }

  finally(callbackFn) {
    callbackFn(this.value);
    return this;
  }
}
