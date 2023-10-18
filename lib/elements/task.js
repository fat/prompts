const color = require('kleur');
const Prompt = require('./prompt');
const { style, clear } = require('../util');
const { erase, cursor } = require('sisteransi');

/**
 * TaskPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
  */
class TaskPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.render();
  }

  reset() {}

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  done(msg) { 
    this.msg = msg || this.msg;
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {}

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    else this.out.write(clear(this.outputText, this.out.columns));
    super.render();

    this.outputText = [
      this.done ? style.symbol(this.done, this.aborted) : color.gray("·"),
      this.done ? this.msg : color.bold(this.msg),
    ].join(' ');

    this.out.write(erase.line + cursor.to(0) + this.outputText);
  }
}

module.exports = TaskPrompt;
