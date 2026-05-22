"use strict";

class MyPromise {
  state = "pending";
  value;

  thenCallbacks = [];
  catchCallbacks = [];

  constructor(executor) {
    const resolve = function (value) {
      if (this.state !== "pending") return;

      this.state = "fulfilled";
      this.value = value;

      queueMicrotask(() => {
        this.thenCallbacks.forEach((fn) => fn(value));
      });
    };

    const reject = function (reason) {
      if (this.state !== "pending") return;

      this.state = "rejected";
      this.value = reason;

      queueMicrotask(() => {
        this.catchCallbacks.forEach((cb) => cb(reason));
      });
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled) {
    return new MyPromise((resolve, reject) => {
      const handleFulfilled = function (value) {
        try {
          // if argument is not a function, assign it to value with resolve
          if (typeof onFulfilled !== "function") {
            resolve(value);
            return;
          }

          const result = onFulfilled(value);

          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === "fulfilled") {
        queueMicrotask(() => handleFulfilled(this.value));
      } else if (this.state === "pending") {
        this.thenCallbacks.push(handleFulfilled);
      } else if (this.state === "rejected") {
        reject(this.value);
      }
    });
  }

  catch(onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleRejected = (reason) => {
        try {
          if (typeof onRejected !== "function") {
            reject(reason);
            return;
          }

          const result = onRejected(reason);

          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === "rejected") {
        queueMicrotask(() => handleRejected(this.value));
      } else if (this.state === "pending") {
        this.catchCallbacks.push(handleRejected);
      } else if (this.state === "fulfilled") {
        resolve(this.value);
      }
    });
  }
}
