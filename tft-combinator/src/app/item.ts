export class Item {
    id: number;
    name: string;

    constructor(id?: any){
        let thisid = 0;
        if (typeof id === 'string')
        {
            thisid = +id;
        }
        else{
            thisid = id;
        }
        this.id = id;
    }
<<<<<<< HEAD
=======

>>>>>>> f385bfa920d1b7fbd6e324b4196f7b6bd4ea5ff6
}
