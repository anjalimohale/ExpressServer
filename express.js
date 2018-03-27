const Joi = require('joi');
const express=require('express');
const app=express();

app.use(express.json());

const courses=[
{id:1,name:'course1'},
{id:2,name:'course2'},
{id:3,name:'course3'}
];

app.get('/', (req,res)=>{
    //Default route
    res.send("Hello World");
});

app.get('/api/courses', (req,res)=>{
    //All courses
    res.send(courses);
});

app.get('/api/courses/:id', (req,res)=>{
  //Get course with course Id   
  var course = courses.find(c=> c.id=== parseInt(req.params.id))
  //Course Id Not Found
  if(!course) 
  res.status(404).send("The courese with given id was not found");
  res.send(course);
}); 

app.post('/api/courses', (req,res) =>{

//validation using Joi
const {error} = validateCourse(req.body)
if(error)
return res.status(400).send(error.details[0].message);
//define id
const course ={
id:courses.length +1,
name: req.body.name
};
courses.push(course);
res.send(course);
});

app.put('/api/courses/:id', (req,res) => {
    //Look up the course
    //If not existing, return 404

    var course = courses.find(c=> c.id=== parseInt(req.params.id));
    if(!course) 
    return res.status(404).send("The courese with given id was not found");
  
    //validate
    //Ifinvalid, return 400 - Bad request
    
    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);

    if(error)
    return res.status(400).send(error.details[0].message); 
    //Update course
    course.name =req.body.name;
    res.send(course);
    //Return the updated course

});

//validate function
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
   return Joi.validate(course,schema)
}

app.delete('/api/courses/:id',(req,res) => {

  //Look up the course
  //If not existing, return 404
    var course = courses.find(c=> c.id=== parseInt(req.params.id));
    if(!course) 
    return res.status(404).send("The courese with given id was not found");
  
    //Delete
    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);

});


//In case port 3000 is not available run on env port
const port=process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Running on port ",port);
});
