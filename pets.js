let fs = require('fs');
// console.log(fs);

let option = process.argv[2]
// let option = process.argv[2]
let optIndex = process.argv[3]



switch (option) {
    case 'read':
        // need the json file, the font, and a function with error being the first parameter and then data as the second parameter. This is for error handling in node  
        fs.readFile('pets.json', 'utf-8', (error, data) => {
            // console.log(data)
            // this is giving an array that's all a string. you need to parse it. 
            // JSON.parse() is synchronous (one step at a time) so we can do this method:
            let pets = JSON.parse(data)
            //console.log(data)
            if (optIndex === undefined) {
                console.log(pets[optIndex]);
            } else if (optIndex < 0 || optIndex >= pets.length - 1) {
                console.error(`Usage: node pets.js read INDEX`)
                process.exit(1)
            } else {
                console.log(pets)
            }
        })
        break;
        
        case 'create':
            let age = process.argv[3]
            let kind = process.argv[4]
            let name = process.argv[5]
            if (age !== undefined && kind !== undefined && name !== undefined) {
                let obj = {};
                obj.age = Number(age);
                obj.kind = kind;
                obj.name = name;
                console.log(obj);
            }
       console.error(`Usage: node pets.js create AGE KIND NAME`)
       break;

    case 'update':
        console.log('you selected update');
        break;

    case 'destory':
        console.log('you selected destory');
        break;

    default:
        //standard error
        console.error(`Usage: node pets.js [read | create | update | destroy]`)
        process.exit(1)
}
