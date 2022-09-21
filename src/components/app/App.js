import { useState } from "react";

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const App = () => {

    const [selectedChar, setChar] = useState(null);

    // state = {
    //     selectedChar: null
    // }
    
    const onCharSelected = (id) => { // подъём состояния устанавливаем значение свойства в state через аргумент
                               // из компанента CharList приходит id записывается в стейт через метод onCharSelected
                               // и далше передаётся в компанент CharInfo
        // this.setState({
        //     selectedChar: id
        // })
        setChar(id);
    }

    return (
        <div className="app">
            <AppHeader/>
            <main>
                {/* {this.state.showRandomChar ? <RandomChar/> : null}
                <button onClick={this.toggleRandomChar}>CLick me</button> */}
                <ErrorBoundary>
                    <RandomChar/>
                </ErrorBoundary>
                {/* <RandomChar/> */}
                <div className="char__content">
                    {/* <CharList onCharSelected={this.onCharSelected}/> */}
                    <ErrorBoundary>
                        <CharList onCharSelected={onCharSelected}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <CharInfo charId={selectedChar}/>
                    </ErrorBoundary>
                    {/* <CharInfo charId={this.state.selectedChar}/> */}
                </div>
                <img className="bg-decoration" src={decoration} alt="vision"/>
            </main>
        </div>
    )
}

export default App;

// this.updateChar(); делать сетевой запрос в кострукторе во врея конструирования класса это плохая практика

// сделаем так что бы клмпанент View можно было показывать или удалять со страници динамически с конопки
// а теперь сделаем что бы этот компанент будет обнавляться каждые 3 секунды с показом нового персонажа и выводить console.log('upDate');
// теперь через каждые 3 секунды приходит 2 upDate потому что идёт 2 заапроса 
// при этом при нажатии на CLick me компанент удаляется но запросы всёравно идут по 2 раза
// есл несколько раз пересоздать компанент нажатием CLick me то каличество запросов стремительно растёт потому что растёт количество
// бывшесозданных компанентов и каждый делает по 2 запроса
// всё потому что мы негде не прописали clearInterval и в каждом бывшесозданном компаненте setInterval бесконечно продалжает работать
// это плохо во первых потому что идут лишние запросы если компанент будет исчезать и появляться то запросов накопится много и 
// браузер может завснуть
// 2 причина в JS если есть ссылка на какой то объект setInterval(this.updateChar, 3000) то он из памяти не удаляется и в таком
// случаем каждый старый компанент сохраняется в памяти на нем есть ссылка это назыается утечкой памяти
// таки вопрос в каком месте компанента прописывать clearInterval

// Жизненный цикл компонентов 
// 3 этапа
// на каждом из этапов можно вызвать определенные функции хуки жизненного цикла


// 1 компанент появляется на странице (Монтирование)
// хук componentDidMount()
// путь жизненного цикла, что зачем вызывается при создании (Монтировании) компанента на странице
// 1 вызывается constructor
// 2 вызывается render() рендерится верстка
// 3 React обновляет DOM сруктуру и рефы
// 4 вызывается хук componentDidMount()


// 2 компанент может обнавляться 2 спосабами new props, setState, команда позволяющая насильно обновить компанент forceUpdate()
// если компанент получает новое свойство new props он перерисовывается обнавляется
// если внутри компанента был изменён state через setState он тоже перерисовывается обнавляется
// хук componentDidUpdate()
// путь жизненного цикла, что зачем вызывается при обновлении компанента на странице
// 1 вызывается render() рендерится верстка
// 2 React обновляет DOM сруктуру и рефы
// 3 вызывается хук componentDidUpdate()

// 3 компанент удаляется со страницы
// хук componentWillUnmount()
// путь жизненного цикла, что зачем вызывается при удалении (Размонтировании) компанента со страници
// 1 вызывается хук componentWillUnmount()


// есть еще 4 этап ошибки когда в компаненте случается ошибка
// хук componentDidCatch()


// проведем эксперемент на каждом этапе вызовем console.log()
// получаем последовательно в консоль constructor render mount нажимаем CLick me получаем unmount 
// нажимаем еще раз CLick me получаем constructor render mount значит хуки работают последовательно

// почему происходит 2 запроса на сервер, запрос мы делали в конструкторе
// в таком случаем в консоль выдаёт constructor render mount upDate upDate render Update 
// из за того что запрос делали в конструкторе реакт делал запрос сначала в конструкторе получал данные но засунут ьих еще некуда потому
// что метод render еще не запущен, потом когда уже доходил до метода render делал запрос еще раз и уже нормально помещал их на страницу

// использовать обновления можно только на этапе коммита тоесть только в 3 онсновных хуках 
// componentDidMount() componentDidUpdate() componentWillUnmount() 
// поэтому лучше всего вызвать обращение к серверу в componentDidMount()
// теперь получаем в консоль constructor render mount upDate render Update 

// есл ипрописывать setInterval в componentDidMount() то в componentWillUnmount() его нужно останавливать clearInterval
// в таком случаем в консоль выдаёт constructor render mount и каждые 3 секунды upDate render Update
// нажимаем CLick me получаем в консоль unmount и запросы больше не идут потому что мы их остановили в componentWillUnmount()
// нажимаем еще раз CLick me получаем тоже поведение constructor render mount и каждые 3 секунды upDate render Update

// также надо удалаять и addEventListener через removeEventListener
