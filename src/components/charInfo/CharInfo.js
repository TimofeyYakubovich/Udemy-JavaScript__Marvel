import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';
// import thor from '../../resources/img/thor.jpeg';

class CharInfo extends Component {

    state = {
        char: null, // пустой объект это уже true а null это false
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps, prevState) { 
        // принимает в себя 3 аргумента, третий используется очень редко
        // принимает как аргументы предыдущее состояние prevState и предыдущие пропсы prevProps
        // если вызвать  this.updateChar(); то получится бесконечный цикл
        // prevProps чаще всего используется что бы проверять изменились пропсы или нет
        if (this.props.charId !== prevProps.charId) {
            // если нововое состояние не равно предыдущему только в таком случае вызываем this.updateChar();
            // это позволяет недопускать бесконечного цикла 
            // и если пользователь будет наживать много раз на одну и ту же карточку запросы не будут уходить
            this.updateChar();
        }
        

    }

    // componentDidCatch(err, info) { // хук вызывается тогда когда в компаненте произошла ошибка
    //     // принимает 2 аргумента err - это сама ошибка info - информация о компаненте в катором произошла ошибка
    //     console.log(err, info);
    //     this.setState({error: true});
    //     // таким образом в консоле не появится никакова сообщения дело в обновлении реакта
    //     // начиная с 16 версии если использовать этот хук при ошибке в одном компаненте будет падать всё приложение
    //     // раньше падал только этот компанент так специально задумано 
    //     // сейчас обзательно использовать предохранители ранише было не обезательно
    //     // предохранители это обезательно только классовые компаненты каторые оборачивают другие компаненты и если в кмопанентах
    //     // которые они оборочивают (дочерних) происходит ошибка то придохранители будут ее ловить при этом приложение падать не будет
    //     // и ломается лишь этот компанент так же можно отрендерить какой то запасной интерфейс вместо сломавшигося
    //     // и записать эту ошибку куда нибудь
    // }

    updateChar = () => {
        const {charId} = this.props;
        
        if (!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService
            .getCharacters(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)

        // допустим специально внесем ошибку
        // this.foo.bar = 0; // теперь при нажатии на одно из персонажей выдаёт ошибку если ее закрыть просто белый лист
    }

    onCharLoaded = (char) => {
        this.setState({
            char,           
            loading: false  
        }); 
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => { 
        this.setState({ 
            loading: false, 
            error: true
        });
    }

    render() {
        const {char, loading, error} = this.state;

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

            // <div className="char__info">
            //     <div className="char__basics">
            //         <img src={thor} alt="abyss"/>
            //         <div>
            //             <div className="char__info-name">thor</div>
            //             <div className="char__btns">
            //                 <a href="#" className="button button__main">
            //                     <div className="inner">homepage</div>
            //                 </a>
            //                 <a href="#" className="button button__secondary">
            //                     <div className="inner">Wiki</div>
            //                 </a>
            //             </div>
            //         </div>
            //     </div>
            //     <div className="char__descr">
            //         In Norse mythology, Loki is a god or jötunn (or both). Loki is the son of Fárbauti and Laufey, and the brother of Helblindi and Býleistr. By the jötunn Angrboða, Loki is the father of Hel, the wolf Fenrir, and the world serpent Jörmungandr. By Sigyn, Loki is the father of Nari and/or Narfi and with the stallion Svaðilfari as the father, Loki gave birth—in the form of a mare—to the eight-legged horse Sleipnir. In addition, Loki is referred to as the father of Váli in the Prose Edda.
            //     </div>
            //     <div className="char__comics">Comics:</div>
            //     <ul className="char__comics-list">
            //         <li className="char__comics-item">
            //             All-Winners Squad: Band of Heroes (2011) #3
            //         </li>
            //         <li className="char__comics-item">
            //             Alpha Flight (1983) #50
            //         </li>
            //         <li className="char__comics-item">
            //             Amazing Spider-Man (1999) #503
            //         </li>
            //         <li className="char__comics-item">
            //             Amazing Spider-Man (1999) #504
            //         </li>
            //         <li className="char__comics-item">
            //             AMAZING SPIDER-MAN VOL. 7: BOOK OF EZEKIEL TPB (Trade Paperback)
            //         </li>
            //         <li className="char__comics-item">
            //             Amazing-Spider-Man: Worldwide Vol. 8 (Trade Paperback)
            //         </li>
            //         <li className="char__comics-item">
            //             Asgardians Of The Galaxy Vol. 2: War Of The Realms (Trade Paperback)
            //         </li>
            //         <li className="char__comics-item">
            //             Vengeance (2011) #4
            //         </li>
            //         <li className="char__comics-item">
            //             Avengers (1963) #1
            //         </li>
            //         <li className="char__comics-item">
            //             Avengers (1996) #1
            //         </li>
            //     </ul>
            // </div>
        )
    }

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