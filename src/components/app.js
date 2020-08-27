import { h, render, Component } from 'preact';
import linkState from 'linkstate';
import CardList from './CardList';

const npsa_cl_products_data = {
    'belair': ['one', 'two', 'three']
};


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
          data: {'null1':{},'null2':{}},
          categories: []
        };
        // this.onHandleChange = this.onHandleChange.bind(this);
        // this.onHandleButton = this.onHandleButton.bind(this);
    }

    // import parksData from 'https://www.parks.sa.gov.au/feed.rss?listname=npsa-cl-products-data';
    componentDidMount() {
        let responseClone;
        let dataClone;
        fetch('https://www.parks.sa.gov.au/feed.rss?listname=npsa-cl-products-data')
          .then(response => response.clone(), 'this')
          .then(data => data.json())
        //   .then(jsonData => console.log('promiseTest: ', jsonData))
        //   .then(data => this.setState(data))
          .then(catData => {
              let state = {};
              let categories = getCategories(catData)
              let data = catData;
              state = {categories, data}
              console.log('new state: ', state)
              this.setState( state )
          })



        }

        onHandleButton = event => {
            // console.log(event);
          console.log('event.target.name: ', event.target.name);  // cardbutton
          console.log('event.target.id: ', event.target.id);
          this.setState({ [event.target.name]: event.target.id })
          // this.setState({ selectedRestaurantName: event.target.id })
        }

    render(props, state) {

        console.log('state....', state);
        // console.log('categories....', state.categories);
        // console.log('npsa_cl_products_data', npsa_cl_products_data);

        return (
            <div>{npsa_cl_products_data}
                <h2>app.js</h2>
                <p>This is Preact.</p>
                <input type="text" placeholder="Search..."></input>
                <div>
                    {/* <ProductTypes
                        mykey = {npsa_cl_products_data.belair[0]}
                        name = {Object.keys(this.state.data)}
                        i = {Object.keys(this.state.data).length}
                        thing = {this.state.categories}
                        // {Object.keys(this.state.data)}
                        // {npsa_cl_products_data.belair[1]}
                        // thing= {this.state.data ? Object.keys(this.state.data) : 'test'}
                        // {data}
                    /> */}
                    <CardList
                        state = {state}
                    />
                </div>
                <div id="bookeasy__region-gadget"><p>Loading gadget</p></div>
            </div>
        )
    }
}

export default App;


const getCategories = (data) => {
    let categories = [];
    let parkCategoriesSet = [];
    let parksList = Object.keys(data);

    parksList.forEach(park => {
        // console.log('park: ', park);
        // console.log('data[park]["Things to book"]: ', data[park]["Things to book"]);
        let parkCategories = Object.keys(data[park]["Things to book"]);

        parkCategoriesSet = parkCategoriesSet.concat( parkCategories );
        // console.log('Object data[park]["Things to book"]: ', parkCategories);
    });
    categories = mergeDedupe(parkCategoriesSet);
    categories = categories.filter(item => item !== 'z'); //remove unwanted "z" item
    // console.log('parkCategoriesSet: ', parkCategoriesSet);
    return categories;
}


// function to only get unique array items
const mergeDedupe = (arr) => {
    return [...new Set([].concat(...arr))];
}
