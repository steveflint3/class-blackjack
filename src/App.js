import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PlayerCard from './image.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      hand: null,
      yourScore: 0,
      compScore: 0,
      result: null,
    };
  }

  componentDidMount = () => {
    this.shuffleDeck();
  };

  shuffleDeck = async () => {
    const api_call = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
    const data = await api_call.json();

    this.setState({
      data,
    });
  };

  deal = async () => {
    const deckId = this.state.data.deck_id;

    const yourHandApiCall = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);
    const compHandApiCall = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);

    const yourHand = await yourHandApiCall.json();
    const localCompHand = await compHandApiCall.json();

    this.setState({
      image: [yourHand.cards[0].image, yourHand.cards[1].image],
      compImage: [localCompHand.cards[0].image, localCompHand.cards[1].image],
      hand: yourHand.cards,
      compHand: localCompHand.cards,
    });
    this.tallyScore(this.state.hand);
    this.tallyCompScore(this.state.compHand);
  };

  hitMe = async () => {
    let localImageArr = [...this.state.image];
    const deckId = this.state.data.deck_id;

    let newCard;
    if (this.state.hand.length <= 4) {
      const api_call = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);

      newCard = await api_call.json();
    } else {
      alert('you have reached your limit');
    }

    localImageArr.push(newCard.cards[0].image);

    this.state.hand.push(newCard.cards[0]);

    this.setState({
      image: localImageArr,
    });
    this.tallyScore(newCard.cards);
  };

  tallyScore = cardVal => {
    for (let i = 0; i < cardVal.length; i++) {
      this.analyzeCard(cardVal[i].value);
    }
    this.scoreCheck();
  };

  tallyCompScore = cardVal => {
    for (let i = 0; i < cardVal.length; i++) {
      this.analyzeCompCard(cardVal[i].value);
    }
    this.scoreCheck();
  };

  scoreCheck = () => {
    if (this.state.yourScore > 21) {
      alert('you busted!  You lose!');
      this.chooseWinner();
    } else if (this.state.compScore > 21) {
      alert('dealer busted, you win!!');
      this.chooseWinner();
    }
  };

  chooseWinner = () => {
    if (this.state.yourScore > this.state.compScore && this.state.yourScore <= 21) {
      this.setState({
        result: 'You win!!',
      });
    } else {
      this.setState({
        result: 'You lose!!',
      });
    }
  };

  analyzeCard = cardValue => {
    if (cardValue === 'QUEEN' || cardValue === 'KING' || cardValue === 'JACK') {
      this.setState({
        yourScore: this.state.yourScore + 10,
      });
    } else if (cardValue === 'ACE') {
      let ace = this.chooseAce(this.state.yourScore);
      this.setState({
        yourScore: this.state.yourScore + ace,
      });
    } else {
      this.setState({
        yourScore: this.state.yourScore + parseFloat(cardValue),
      });
    }
  };

  analyzeCompCard = cardValue => {
    if (cardValue === 'QUEEN' || cardValue === 'KING' || cardValue === 'JACK') {
      this.setState({
        compScore: this.state.compScore + 10,
      });
    } else if (cardValue === 'ACE') {
      let ace = this.chooseAce(this.state.compScore);
      this.setState({
        compScore: this.state.compScore + ace,
      });
    } else {
      this.setState({
        compScore: this.state.compScore + parseFloat(cardValue),
      });
    }
  };

  chooseAce = scoreVal => {
    let ace;
    if (scoreVal + 11 > 21) {
      ace = 1;
    } else {
      ace = 11;
    }
    return ace;
  };

  render() {
    console.log('here is yourScore', this.state.yourScore);
    // console.log("image info", )
    return (
      <div className="App">
        <header className="App-header">
          <h3>Computer Score: {this.state.compScore}</h3>
          <div>
            <img id="computerCard" src={PlayerCard} />
            <img id="computerCard" src={PlayerCard} />
          </div>
          <div>{this.state.image ? this.state.image.map(p => <img src={p} />) : <div />}</div>
          <h1>{this.state.result}</h1>
          <button onClick={() => this.deal()}>Deal</button>
          <button onClick={() => this.hitMe()}>Hit me</button>
          <h3>My Score: {this.state.yourScore}</h3>
        </header>
      </div>
    );
  }
}

export default App;
