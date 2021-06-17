var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var today;


//create feed and lastFed variable here
var feedDog, lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  today = new Date();

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feedDog=createButton("Feed Dog");
  feedDog.position(630,95);
  feedDog.mousePressed(feedTheDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();


  //write code to read fedtime value from the database 
  database.ref("/").on("value",(data)=>{
    lastFed = data.val()
    lastFed = lastFed.FeedTime
  })
 
  //write code to display text lastFed time here
  
  fill("black")
  textSize(20)
  if(lastFed==0){

    text("Last fed at 12 AM", 470, 100)
  }
  else if (lastFed>0 && lastFed<12){
    text("Last fed at "+lastFed+" PM", 470, 100)
  }
  else{
    text("Last fed at "+lastFed+" AM", 470, 100)
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedTheDog(){
  dog.addImage(happyDog);
  if (foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(0)
  }
  else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)
    
  }
  
  //write code here to update food stock and last fed time
  database.ref('/').update({Food:foodObj.foodStock})
  database.ref('/').update({FeedTime:today.getHours()-12})
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}