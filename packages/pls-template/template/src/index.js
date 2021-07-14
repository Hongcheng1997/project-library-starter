class MyWebpack {
  constructor() {
    this.name = 'ghc1';
    console.log(this.getName());
  }

  getName() {
    return this.name;
  }
}

new MyWebpack();
