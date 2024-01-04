import { useState } from 'react'


const Button = ({text, buttonHandler}) => <button onClick={buttonHandler}>{text}</button>

const AnecdoteDisplay = ({anecdotes, votes, i}) => {
  return (
    <>
    {anecdotes[i]}
    <div/>
    has {votes[i]} votes
    <div/>
    </>
  )
}

const MostVotedDisplay = ({anecdotes, votes}) => 
{
  const i = votes.indexOf(Math.max(...votes))
  return (
    <>
      <h1>
        Anecdote with most votes
      </h1>
      <AnecdoteDisplay anecdotes={anecdotes} votes={votes} i={i}/>
    </>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]


  const onNextAnecdote = ({anecdotes}) => () => setSelected(Math.floor(Math.random()*anecdotes.length))
  const onVote = () => () => {
    const new_votes = [... votes]
    new_votes[selected] += 1
    setVotes(new_votes)
  }

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <AnecdoteDisplay anecdotes={anecdotes} votes={votes} i={selected}/>
      <Button text="vote" buttonHandler={onVote()}/>
      <Button text="next anecdote" buttonHandler={onNextAnecdote({anecdotes})}/>
      <MostVotedDisplay anecdotes={anecdotes} votes={votes}/>
    </div>
  )
}

export default App