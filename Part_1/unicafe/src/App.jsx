import { useState } from 'react'


const Header = () => <h1>give feedback</h1>

const Button = ({text, buttonHandler}) => <button onClick={buttonHandler}>{text}</button>


// const StatisticLine = ({text, value}) => <div>{text} {value}</div> // Unused due to table


const StatisticsTable = ({lines}) => <table><tbody>{lines}</tbody></table>
const StatisticLineTable = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = function({good, neutral, bad}) {
  if (good + neutral + bad === 0) {
    return <p>No feeback given</p>
  }

  const StatsTableElements = [
    <StatisticLineTable key="good" text="good" value={good}/>,
    <StatisticLineTable key="neutral" text="neutral" value={neutral}/>,
    <StatisticLineTable key="bad" text="bad" value={bad}/>,
    <StatisticLineTable key="all" text="all" value={good+neutral+bad}/>,
    <StatisticLineTable key="average" text="average" value={(good-bad)/(good+neutral+bad)}/>,
    <StatisticLineTable key="positive" text="positive" value={100*good/(good+neutral+bad) + " %"}/>
  ]


  return (
    <div>
      <p/>
      <h1>statistics</h1>
      <p/>
      <StatisticsTable lines={StatsTableElements}/>
    </div>
  )


  /*
  // Dont Get Here Because we started using the table
  return (
    <div>
      <p/>
      <h1>statistics</h1>
      <p/>
      <StatisticLine text="good" value={good}/>
      <StatisticLine text="neutral" value={neutral}/>
      <StatisticLine text="bad" value={bad}/>
      <StatisticLine text="average" value={(good-bad)/(good+neutral+bad)}/>
      <StatisticLine text="positive" value={100*good/(good+neutral+bad) + " %"}/>
    </div>
  )
  */
}

const updateReview = (updateFunc, value) => () => updateFunc(value)




const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <Header/>
      <Button text="good" buttonHandler={updateReview(setGood, good+1)}/>
      <Button text="neutral" buttonHandler={updateReview(setNeutral, neutral+1)}/>
      <Button text="bad" buttonHandler={updateReview(setBad, bad+1)}/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App