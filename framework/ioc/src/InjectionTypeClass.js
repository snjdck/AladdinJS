
import newClass from 'lambda/newClass';

class InjectionTypeClass
{
	constructor(realInjector, klass){
		this.realInjector = realInjector;
		this.klass = klass;
	}
	getValue(injector, id){
		let value = newClass(this.klass);
		this.realInjector.injectInto(value);
		return value;
	}
}

export default InjectionTypeClass;
