
import newClass from 'lambda/newClass';

class InjectionTypeSingleton
{
	constructor(realInjector, klass){
		this.realInjector = realInjector;
		this.klass = klass;
		this.value = null;
	}
	getValue(injector, id){
		if(!this.value){
			this.value = newClass(this.klass);
			this.realInjector.injectInto(this.value);
			this.realInjector = null;
			this.klass = null;
		}
		return this.value;
	}
}

export default InjectionTypeSingleton;
