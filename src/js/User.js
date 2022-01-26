export default class User{
	constructor(name){
		this.name = name;
	}

	getName(){
		return `Hello, my name is ${this.name}!`
	}
}