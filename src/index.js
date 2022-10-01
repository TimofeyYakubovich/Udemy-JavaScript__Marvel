import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
// import MarvelService from './services/MarvelService';

import './style/style.scss';

// const marvelService = new MarvelService(); // создаём экземпляр класса

// marvelService.getAllCharacters().then(res => console.log(res))
// // испольхуем метод getAllCharacters экземпляра класса marvelService, then() потому что возвращается промис из getResource
// // res результат запроса
// marvelService.getCharacters(1009224).then(res => console.log(res))

// marvelService.getAllCharacters().then(res => res.data.results.forEach(item => console.log(item.name)));
// плучае объект с 9 персонажеми обрщаемся к объекту data в нем к массиву results перебираем его forEach и выводим в консоль только name

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// синтаксис встраивания приложения на страницу React18
ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        // <React.StrictMode>
            <App />
    //   </React.StrictMode>
    );

