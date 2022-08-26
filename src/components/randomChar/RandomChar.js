import { Component } from 'react/cjs/react.production.min';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
// import thor from '../../resources/img/thor.jpeg';  // импортруем картинки в thor запишится путь к картинке
// картинку удаляем вместо нее придёт thumbnail от сервера
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    // constructor(props) { // создаём консруктор что бы вызвать метод updateChar при загрузке страници
    //     super(props);
    //     // this.updateChar(); // метод updateChar вызывается в конструкторе и получается вызывает setState на компаненте который еще не появился на странице так нельзя но пока оставим так
    //     // setInterval(this.updateChar, 3000)
    //     console.log('constructor');
    // }
    // используем синтаксис полей классов тоесть без конструктора
    state = {
        char: {}, // свойства персонажа поместим в отдельный объект потому что в state будут лежать и другие свойства
        // name: null,
        // description: null,
        // thumbnail: null,
        // homepage: null,
        // wiki: null
        loading: true, // это свойство будет отвечать за то что сейчас идёт загрузка компанента или нет
        error: false
    }

    // создаём новое свойство внутри класса RandomChar и туда помещаем новый конструктор
    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();                  // сначала обращаемся к серверу для первичного обновления 
        // this.timerID = setInterval(this.updateChar, 3000); // потом обращаемся к серверу через каждые 3 секунды
        // console.log('mount');
    }

    // componentDidUpdate() {
    //     console.log('Update');
    // }

    // componentWillUnmount() {
    //     clearInterval(this.timerID);
    //     // console.log('unmount');
    // }

    onCharLoaded = (char) => {
        // console.log('upDate');
        // this.setState({char: char}); // можно сократить
        this.setState({
            char,           // свойство char и на его место приходит новый объект
            loading: false  // как только придут данные от getCharacters сработает onCharLoaded и loading станет false
        }); 
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => { 
        this.setState({ 
            loading: false, // если произошла ошибка значит нет загрузки спиннера
            error: true
        });
    }

    // создадим метод каторый будет обращаться к серверу получать данные и записывать их в state
    updateChar = () => {
        // this.foo.bar = 0;
        // const id = 1011005;
        // реализуем случайный id от одного числа до другова числа
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // Math.floor что бы округлить число до целого
        this.onCharLoading();
        this.marvelService
        // .getAllCharacters()
        // .then(res => console.log(res)); // приходит 2 массива поочереди потому что мы вызываем метод updateChar внутри конструктора
        .getCharacters(id) // обращаемся к методу каторый получает 1 персонажа с сервера по id
        // .then(res => {  // тут в res попадает уже готовый объект из метода _transformCharacter и мы его просто передаём в setState
        //     this.setState(res) // запись одного персонажа в стейт вынисем в отдельный метод потому что он будет повторяться
        // })
        .then(this.onCharLoaded) // когда мы используем промисы в эту функцию then приходит аргумент и если в then засписана просто
        // ссылка на функцию то этот аргумент каторый приходит в then передаётся в записаную функцию
        // тоесть в метод onCharLoaded как char и запишется внутрь стейта
        // .then(res => {    // обрабатываем полученный результат
        //     this.setState({ // тут нет зависимсоти от предыдущего state потому что каждый раз приходит новый персонаж
        //         name: res.data.results[0].name, // так как results это массив и приходит нам только один персонаж можно обратиться к 
        //         // к первому элименту results[0]
        //         description: res.data.results[0].description,
        //         thumbnail: res.data.results[0].thumbnail.path + '.' + res.data.results[0].thumbnail.extension,
        //         homepage: res.data.results[0].urls[0].url,
        //         wiki: res.data.results[0].urls[1].url
        //     })
        // })
        .catch(this.onError) // когда произошла ошибка внутри запроса срабатывает метод onError
    }

    render() {
        // console.log('render')
        // const {name, description, thumbnail, homepage, wiki} = this.state;
        // const {char: {name, description, thumbnail, homepage, wiki}, loading} = this.state;// теперь нам не нужно вытаскивать всё из char
        const {char, loading, error} = this.state;
        // такая конструкция когда подгружается какой то компанент из условия называется условный рендеренг
        // if (loading) { // если loading будет true то мы просто подгружаем этот компанент Spinner
        //     return <Spinner/> // если функция видит return то на этом она прекращает свою работу 
        // }                     // тоесть вся верстка ниже в return не подгрузится 

        // есть 3 состояния и их надо как то условно размещать в интерфейсе в зависимости от состояния
        // состояния 3 и их уже надо вынести из return
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;
        // есл нет загрузки loading = null и при этом нет ошибки error = null то в переменную content помещается View

        return (
            <div className="randomchar">
                {/* <div className="randomchar__block">
                    <img src={thumbnail} alt="Random character" className="randomchar__img"/>
                    <div className="randomchar__info">
                        <p className="randomchar__name">Thor</p>
                        <p className="randomchar__name">{name}</p>
                        <p className="randomchar__descr">
                            {/* As the Norse God of thunder and lightning, Thor wields one of the greatest weapons ever made, the enchanted hammer Mjolnir. While others have described Thor as an over-muscled, oafish imbecile, he's quite smart and compassionate... */}
                            {/* {description} */}
                        {/* </p>
                        <div className="randomchar__btns">
                            <a href="#" className="button button__main">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href="#" className="button button__secondary">
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a> */}
                        {/* </div> */}
                    {/* </div> */}
                {/* </div> */}
                {/* // условный рендеринг */}
                {/* {loading ? <Spinner/> : <View char={char}/>} */}
                {/* если в какую то из этих переменных попадает null то на странице ничего не отрендерется */}
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

// в пределах одного компанента разработчики разделяют компанент на несколько частей логические и рендерещие компаненты
// создадим простой рендерещие компанет каторый будет отображать кусочек верстки без логики
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {'objectFit' : 'contain'}
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;