
console.log('Hello world');

let age = 23;
let name = 'Boruto';
let categories = ["chaussures", "bijoux", "pantalons"];
let active = true;

if (age>10){
    console.log(categories);
}

//for index, cat in enumerate(categories)
categories.forEach((cat, index) => {
    console.log(index +':'+ cat);
});

//for cat in categories
categories.forEach((cat) => {
    console.log(cat);
});