class ExpandableArray {
  constructor(initial, defaultValue) {
    this.values = Array.from(initial);
    this.defaultValue = defaultValue;

    this.offset = 0;
  }

  expandLeft(n) {
    const empty = Array.from({ length: n }).fill(this.defaultValue);

    this.values = [...empty, ...this.values];
    this.offset += n;
  }

  expandRight(n) {
    const empty = Array.from({ length: n }).fill(this.defaultValue);

    this.values = [...this.values, ...empty];
  }

  getStartIndex() {
    return -1 * this.offset;
  }

  getEndIndex() {
    return this.values.length + this.offset;
  }

  get(i) {
    const delta = i + this.offset;
    if (delta < 0 || delta >= this.values.length) {
      return this.defaultValue;
    }
    return this.values[i + this.offset];
  }

  getWithContext(i, n = 2) {
    const output = [];
    for (let x = i - 2; x <= i + 2; x++) {
      output.push(this.get(x));
    }

    return output.join('');
  }

  set(i, value) {
    const delta = i + this.offset;

    const belowBounds = delta < 0;
    const aboveBounds = delta >= this.values.length;
    const outOfBounds = belowBounds || aboveBounds;

    const isDefault = value === this.defaultValue;

    if (!isDefault && belowBounds) {
      this.expandLeft(Math.abs(delta));
    }

    if (!isDefault && aboveBounds) {
      this.expandRight(this.values.length - delta + 1);
    }

    if (!isDefault || (isDefault && !outOfBounds)) {
      this.values[i + this.offset] = value;
    }
  }

  entries() {
    const entries = Array.from(this.values.entries());
    return entries.map(([index, value]) => ([index - this.offset, value]));
  }

  contexts(n = 2) {
    const start = this.getStartIndex();
    const end = this.getEndIndex();

    const contexts = [];
    for (let i = start - 2; i < end + 2; i++) {
      contexts.push([i, this.getWithContext(i, n)]);
    }

    return contexts;
  }

  size() {
    return this.values.length;
  }
}

module.exports = ExpandableArray;
