import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    // state = {
    //     charList: [],
    //     loading: true, // loading изначально true потому что первичная загрузка первых 9 персонажей идёт полюбому
    //     error: false,
    //     newItemLoading: false, // newItemLoading будет вызываться вручную после того как где то вызовется onRequest
    //     offset: 210,
    //     charEnded: false
    // }

    // marvelService = new MarvelService();

    // const marvelService = new MarvelService();
    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true); // onRequest() стрелочная функция но мы ее вызываем до ее объявления потому что useEffect вызывается после рендера
                     // тоесть после того как onRequest уже сущесвтует внутри компанента
    }, [])

    // componentDidMount() {
    //     this.onRequest();
    // }

    const onRequest = (offset, initial) => {
        // теперь при первичной подгрузке персонажей видем спинер это нормально
        // но и при последующих подгрузках новые персонажи добавляются но перед этим все исчезают и заменяются на спиннер это не нормально
        // должны подгружаться без исчезновения и спиннера
        // происходит это потому что в useMarvelService перед запросом переводим loading в true всегда
        // изменяется состояние идет перересовка компанента (исчезают персонажи и выдает спинер потому что loading в true)
        // введем аргумент initial и взависимости от него будем устанавливать setNewItemLoading
        // при первичной подгрузке initial true значит setNewItemLoading(false) при последующих подгрузках initial false - setNewItemLoading(true)
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        // onCharListLoading(); // при первичой загрузке он переведет newItemLoading в true но в onCharListLoaded переводим в false
        // setNewItemLoading(true);
        // marvelService.getAllCharacters(offset)
        getAllCharacters(offset)
            .then(onCharListLoaded)
            // .catch(onError)
    }

    // const onCharListLoading = () => {
    //     setNewItemLoading(true);
    //     // this.setState({
    //     //     newItemLoading: true
    //     // })
    // }

    const onCharListLoaded = (newCharList) => { // получает как аргумент массив с новыми 9 персонажеми
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        // this.setState(({offset, charList}) => ({ // передаём стейт charList
        //     charList: [...charList, ...newCharList],
        //     loading: false,
        //     newItemLoading: false,
        //     offset: offset + 9, // каждый раз когда приходит успешный ответ от сервера отступ по получение персонажей увеличиваем на 9
        //     charEnded: ended
        // }))

        setCharList([...charList, ...newCharList]);
        // setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    // Lesson 171
    // batching это когда реакт объеденяет несколько изменений состояний в одну операцию для улучшение производительнсти
    // при версии реакта 17.0.2 при повтороной дозагрузке персонажей Charalist в кансоль выдает 6 раз
    // потому что все изменения стейта находятся внутри then асинхронного кода и реакт даже не пытается объеденить все изменения стейтов в одно
    // при версии реакта 18.2.0 при повтороной дозагрузке персонажей Charalist в кансоль выдает 2 раз
    // компанент перерендоревается намного меньше раз при изменении всех стейтов
    // console.log('Charalist');

    // const onError = () => {
    //     // this.setState({
    //     //     error: true,
    //     //     loading: false
    //     // })
    //     setError(true); // сдесь мы можем просто передать true без колбек функции потому что тут не важно что было в предыдущем стейте
    //     setLoading(loading => false);
    // }

    // itemRefs = [];
    const itemRefs = useRef([]);
    // useRef можно использовать только на верхнем уровне компанента
    // его нельзя помещать в условия, внутренние функции, циклы и тд.

    // setRef = (ref) => {
    //     this.itemRefs.push(ref);
    // }

    const focusOnItem = (id) => {
        // сдесь мы не используем свойство current потому что создаем массив ссылок при помощи 
        //отдельной функции setRef в каторой пушим напрямую в itemRefs без свойства current

        // this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        // this.itemRefs[id].classList.add('char__item_selected');
        // this.itemRefs[id].focus();

        // но когда созадем ссылки при помощи useRef то тут уже будет объект у каторого будет свойство current
        // в itemRefs.current складывается массив ссылок
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = {'objectFit' : 'unset'}
            }

            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li 
                        className="char__item"
                        tabIndex={0} // при помощи tabIndex можно поставить ручной фокус даже на дивы и спены
                        // ref={this.setRef}
                        // в классовом компаненте что бы устанавливать массив ссылок при помощи колбек рефов использовали функцию setRef
                        // в ней напрямую пушили ссылку в массив
                        // сейчас напишем функцию прямо внутри рефа
                        // в ref может помещаться колбек реф каторый принимает в себя единственным аргументом тот элимент li на катором он был вызван
                        ref={el => itemRefs.current[i] = el}
                        // el - элимент на катором происходит действие, ссылка на дом элимент
                        // сдесь будем использовать не push а простой синтаксис itemRefs.current[i] = el
                        // в массив itemRefs.current складываем все элименты el попорядку
                        // key={item.id}
                        onClick={() => {
                            props.onCharSelected(item.id)
                            focusOnItem(i)
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id)
                                focusOnItem(i)
                            }
                        }}>
                            <img src={item.thumbnail} alt="abyss" style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    // const {charList, loading, error, newItemLoading, offset, charEnded} = this.state; это строчка уже не нужна так как эти переменные уже существуют

    // const items = this.renderItems(charList);
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading ? <Spinner/> : null;
    // таким образом спинер будет показываться тольк при первичной подгрузке когда newItemLoading false
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    // теперь при повтороной подгрузке спинера уже нет но персонажи всеравно исчезают
    // происоходит это потому что состояние charList и loading  каждый раз меняются и перересовывается интерфейс через условие
    // в функциональных компанентах каждый раз идет пересоздание контента внутри когда компанент обновляется
    // поэтоу карточки исчезают при каждом изменении charList и loading
    // когда мы использовали классы мы использовали свойтво класса каторое содержало в себе массив данных
    // в таком случае переменная content каждый раз пересоздается
    // можно это переменную просто удалить и рендерить items напрямую даже если он пустой
    // а вот если в какой то момент мы помещаем в верстку null из этого условного рендернга то в таком случае и прыгает верстка персонажи исчезают
    // const content = !(loading || error) ? items : null;
 
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {/* {content} */}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading} // disabled блокирует кнопку
                style={{'display' : charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;