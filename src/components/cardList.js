import { h, render, Component } from 'preact';
import Card from './Card';


const CardList = ( {state} ) => {

    console.log('here state: ', state);
      const categories = state ? ['null']: state[categories];
      console.log('here categories: ', categories);

      return (
          <div className="CardList booking-types_container">

                <h5>CardList </h5>

              {
                  categories.map((item, i) => {
                    //   console.log('item: ', item);
                      return (
                          <div className="fl w-100">
                              <Card
                                  key={i.toString()}
                                  name={item}
                                  state={state}
                                  onHandleButton={'onHandleButton'}
                              />
                          </div>
                      );
                  })
              }
          </div>
      );

}

// render(<CategoriesList />, document.body);

export default CardList;
