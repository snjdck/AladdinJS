
class InjectionTypeValue
{
	constructor(realInjector, value){
		this.realInjector = realInjector;
		this.value = value;
	}
	getValue(injector, id){
		if(this.realInjector){
			injector = this.realInjector;
			this.realInjector = null;
			injector.injectInto(this.value);
		}
		return this.value;
	}
}

export default InjectionTypeValue;
