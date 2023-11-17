export class Fetcher<K> {
  data: null | K;
  promise: null | Promise<void>;
  error: any;
  constructor(private fetcher: () => Promise<K>) {}
  fetch() {
    if (this.data != null) return this.data;
    if (this.error != null) throw this.error;
    if (!this.promise) {
      this.promise = this.fetcher()
        .then((data) => {
          this.data = data;
        })
        .catch((error) => {
          this.error = error;
        });
    }
    throw this.promise;
  }
}
