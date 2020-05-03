class EventEmitter{
    constructor(){
        this.callbacks = {}
    }

    on(event, callback){
        if(!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(callback)
    }

    emit(event, data){
        let callbacks = this.callbacks[event]
        if(callbacks){
            callbacks.forEach(callback => callback(data))
        }
    }
}
export const bus = new EventEmitter();
