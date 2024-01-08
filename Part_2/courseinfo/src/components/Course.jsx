const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <h3>total of {sum} exercises</h3>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>


const Content = ({ parts }) =>
  parts.map(part => <Part key={part.name} part={part}/>)


const Course = ({course, parts}) => 
  <>
    <Header course={course} />
    <Content parts={parts} />
    <Total sum={parts.map(part => part.exercises).reduce((s,p) => s+p, 0)} />
  </>


export default Course