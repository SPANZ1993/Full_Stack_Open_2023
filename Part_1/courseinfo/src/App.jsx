const Header =  (props) => {
  return (
    <h1>
      {props.course.name}
    </h1>
  )
}


const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercise}
    </p>
  )
}

const Content =  (props) => {
  const names = props.course.parts.map(part => part.name)
  const exercises = props.course.parts.map(part => part.exercises)
  return (
    <div>
      <Part part={names[0]} exercise={exercises[0]}/>
      <Part part={names[1]} exercise={exercises[1]}/>
      <Part part={names[2]} exercise={exercises[2]}/>
    </div>
  )
}

const Total = (props) => {
  const exercises = props.course.parts.map(part => part.exercises)
  return (
    <p>
      Number of exercises {exercises[0] + exercises[1] + exercises[2]}
    </p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App