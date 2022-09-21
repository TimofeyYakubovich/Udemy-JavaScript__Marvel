import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';
// import thor from '../../resources/img/thor.jpeg';

const CharInfo = (props) => {

    // state = {
    //     char: null, // пустой объект это уже true а null это false
    //     loading: false,
    //     error: false
    // }

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    // componentDidMount() {
    //     this.updateChar();
    // }

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.props.charId !== prevProps.charId) {
    //         this.updateChar();
    //     }
    // }

    useEffect(() => {
        updateChar();
    }, [props.charId])

    // updateChar = () => {
    //     const {charId} = this.props;
        
    //     if (!charId) {
    //         return;
    //     }

    //     this.onCharLoading();

    //     this.marvelService
    //         .getCharacters(charId)
    //         .then(this.onCharLoaded)
    //         .catch(this.onError)
    // }

    const updateChar = () => {
        const {charId} = props;
        
        if (!charId) {
            return;
        }

        onCharLoading();

        marvelService
            .getCharacters(charId)
            .then(onCharLoaded)
            .catch(onError)
    }

    // onCharLoaded = (char) => {
    //     this.setState({
    //         char,           
    //         loading: false  
    //     }); 
    // }
    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    // onCharLoading = () => {
    //     this.setState({
    //         loading: true
    //     })
    // }
    const onCharLoading = () => {
        setLoading(true);
    }

    // onError = () => { 
    //     this.setState({ 
    //         loading: false, 
    //         error: true
    //     });
    // }
    const onError = () => { 
        setLoading(false);
        setError(true);
    }
    
        // const {char, loading, error} = this.state;

        const sceleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {sceleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )

}

const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {'objectFit' : 'contain'}
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is comics with this character'}
                {/* если комиксы есть то ничег не рендерится на страницу null если нет до выдаёт сообщение  */}
                {
                    comics.map((item, i) => {
                        if (i > 9) return; // но если там 1000 таких комиксов то метод всёравно не прервётся всю 1000 всёравно прогонит
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

// Lesson 155 Проверка типов с помощью PropTypes

// динамическая и статическая типизации
// разрабатывать продукты в статической типезации немного попроще когда все данные остаются в том же типе
// одна из надстроек в JS в этом ключе называется TypeScript ее соеденяют с реактом при необходимости

// так же можно следить за типами данных и пропсов внутри компанентов можно использовать технологию PropTypes
// до версии 15.5 эта возможоность была сразу включена в реакт потом ее вынесли в отдельный npm пакет 
// устанавливаем как обычную библиотеку npm i prop-types --save
// ключ --save для того что бы сохранить в список зависимостей
// попростому теперь мы можем прписывать правила для проверки пропсов (как название пакета PropTypes типы пропсов)
// если пропсы не подходят по типам то он будет выдавать умедомление в терминале
// эта библиотека работает только в режиме разработки

// что бы типировать пропсы импортируем PropTypes import PropTypes from 'prop-types';
// теперь можно брать компанент CharInfo и проверять те пропсы каторые в него приходят

CharInfo.propTypes = { // берем компанент CharInfo и задаем ему статичное свойство propTypes
    // дпоусти проверям charId должен быть числом
    charId: PropTypes.number // записываем в объект как свойство название того проперти каторое приходит charId
           // а значением этого свойства записываем его валидацию чем оно должно являться 
           // для этого используем PropTypes то что мы импортировали и то на что хотим проверять number на число
    // charId: PropTypes.string // в таком случаем получаем уведомление что получили число но ожидали строку
}

// так можно проверять на булевые значения, массивы, числа, функции, объекты, строки, символы, ноды, элименты и тд.
// на определенную структуру shape указываем определенный обект каторому должно соответствовать проперти
// дополнение isRequired можно добавлять к любому типу что бы показывать уведомление если пропс не передан тоесть обязательный пропс будет
// так же можно писать собственные валидаторы

// с помощью PropTypes можно устанавливать пропсы по умолчанию тоесть если ничего не было передано то что то установить поумолчанию
// для этого есть свойство defaultProps 
export default CharInfo;