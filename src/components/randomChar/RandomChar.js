import { useState, useEffect } from 'react';
// import Spinner from '../spinner/spinner';
// import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    // state = {
    //     char: {},
    //     loading: true,
    //     error: false
    // }

    const [char, setChar] = useState({});
    // эти состояния нам уже не нужны
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);

    // marvelService = new MarvelService();
    // теперь уже сервис надо создавать не так
    // const marvelService = new MarvelService();
    // loading, error как состояния getCharacters для запроса получения персонажа
    // const {loading, error, getCharacters, clearError} = useMarvelService();
    const {getCharacters, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
        const timerId = setInterval(updateChar, 60000);

        return() => {
            clearInterval(timerId);
        }
    }, [])

    // componentDidMount() {
    //     this.updateChar();
    // }

    // onCharLoaded = (char) => {
    //     this.setState({
    //         char,           // свойство char и на его место приходит новый объект
    //         loading: false  // как только придут данные от getCharacters сработает onCharLoaded и loading станет false
    //     }); 
    // }

    const onCharLoaded = (char) => {
            setChar(char);
            // setLoading(false); // сдесь тоже можно удалить Loading он заменен в useMarvelService
    }

    // onCharLoading = () => {
    //     this.setState({
    //         loading: true
    //     })
    // }

    // onCharLoading onError уже не нужны они заменены в useMarvelService
    // const onCharLoading = () => {
    //     setLoading(true);
    // }

    // // onError = () => { 
    // //     this.setState({ 
    // //         loading: false,
    // //         error: true
    // //     });
    // // }

    // const onError = () => { 
    //     setLoading(false);
    //     setError(true);
    // }

    // updateChar = () => {
    //     const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // Math.floor что бы округлить число до целого
    //     this.onCharLoading();
    //     this.marvelService
    //     .getCharacters(id)
    //     .then(this.onCharLoaded)
    //     .catch(this.onError) // когда произошла ошибка внутри запроса срабатывает метод onError
    // }

    const updateChar = () => {
        clearError(); // даже если запрос пришел с ошибкой с следующим нажатием кнопки try it ошибка очистися 
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // Math.floor что бы округлить число до целого
        // onCharLoading(); заменен в useMarvelService
        // marvelService
        //     .getCharacters(id)
        getCharacters(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
            // .catch(onError) заменен в useMarvelService // когда произошла ошибка внутри запроса срабатывает метод onError
    }

        // const {char, loading, error} = this.state;
        // const errorMessage = error ? <ErrorMessage/> : null;
        // const spinner = loading ? <Spinner/> : null;
        // const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="randomchar">
                {/* {errorMessage}
                {spinner}
                {content} */}
                {setContent(process, View, char)}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
}

// в пределах одного компанента разработчики разделяют компанент на несколько частей логические и рендерещие компаненты
// создадим простой рендерещие компанет каторый будет отображать кусочек верстки без логики
const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki} = data;

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