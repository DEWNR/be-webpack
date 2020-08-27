import { h, render, Component } from 'preact';
import linkState from 'linkstate';



const Card = ({name, checked, state}) => { //destructuring to create simple properties

    const toggle = e =>  {
        let checked = !state.checked;
        // this.setState({ checked });
        // this.selectCard(Offer.OfferId)
        // linkState(this, 'text');
      };
    // console.log('name: ', name);

    // selectCard(offerId) {
    //     this.setState({ cardActive: offerId });
    // }

    return (
        <div className='Card   tc w-100 black-80 bg-light-gray pa3'
            key={name}
            onClick={toggle}>
            <button
                id={name}
                name='cardinput'
                checked={checked}
                >
            </button>
            <label for={name}>
                {name}
            </label>
        </div>
    );
}

export default Card;
// onClick={this.toggle}