export default class Transaction {
  static ID_COUNTER = 1;

  constructor(title, value, type) {
    this.id = Transaction.ID_COUNTER++;
    this.title = title;
    this.value = value;
    this.type = type;
  }

}