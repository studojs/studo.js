/**
 * Subset of https://github.com/discordjs/collection
 */
export class Collection<Value> extends Map<string, Value> {
  /**
   * @returns The first value in this collection
   */
  first() {
    return this.values().next().value;
  }

  /**
   * Maps each item to another value into an array. Identical in behavior to
   * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
   *
   * @param fn Function that produces an element of the new array, taking three arguments
   */
  map<T>(fn: (value: Value, key: string, collection: this) => T): T[] {
    const iter = this.entries();
    return Array.from({ length: this.size }, () => {
      const [key, value] = iter.next().value;
      return fn(value, key, this);
    });
  }

  /**
   * Identical to
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
   * but returns a Collection instead of an Array.
   *
   * @param fn The function to test with (should return boolean)
   * @param thisArg Value to use as `this` when executing function
   */
  public filter(fn: (value: Value, key: string, collection: this) => boolean): Collection<Value> {
    const results = new Collection<Value>();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  /**
   * The sort method sorts the items of a collection in place and returns it.
   *
   * @param compareFunction Specifies a function that defines the sort order.
   * If omitted, the collection is sorted according to each character's Unicode code point value, according to the string conversion of each element.
   */
  sort(compareFunction: Comparator<string, Value>) {
    const entries = [...this.entries()];
    entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]));

    // Perform clean-up
    super.clear();

    // Set the new entries
    for (const [k, v] of entries) {
      super.set(k, v);
    }
    return this;
  }

  /**
   * Creates an identical shallow copy of this collection.
   */
  clone() {
    return new Collection(this);
  }
}

/**
 * @internal
 */
export type Comparator<K, V> = (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number;
