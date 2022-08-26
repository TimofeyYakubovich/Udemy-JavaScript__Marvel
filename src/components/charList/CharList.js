import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';

import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {

    state = {
        charList: [],
        loading: true, // loading изначально true потому что первичная загрузка первых 9 персонажей идёт полюбому
        error: false,
        newItemLoading: false, // newItemLoading будет вызываться вручную после того как где то вызовется onRequest
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        // this.foo.bar = 0;
        // this.marvelService.getAllCharacters()
        // .then(this.onCharListLoaded)
        // .catch(this.onError)
        this.onRequest();

        // если реализовывать дозагрузку по скроллу то в такм слечаем придётся в componentDidMount навешивать обработчик события 
        // window.addEventListener событие скоролла но в реакте при удалении элемента надо удалять и обработчик события 
        // в componentWillUnmount window.removeEventListener
    }

    onRequest = (offset) => {
        this.onCharListLoading(); // при первичой загрузке он переведет newItemLoading в true но в onCharListLoaded переводим в false
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    // onCharListLoaded = (charList) => {
    //     this.setState({
    //         charList,
    //         loading: false,
    //         newItemLoading: false
    //     })
    // }

    // при нажатии на конопку load more когда новые данные пришли 9 персонажей мы их будем добавлять в массив charList и их станет 18

    onCharListLoaded = (newCharList) => { // получает как аргумент массив с новыми 9 персонажеми
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        // теперь когда мы грузим новых персонажей state зависит от предыдущего стейта поэтому помещаем в колбек
        this.setState(({offset, charList}) => ({ // передаём стейт charList
            charList: [...charList, ...newCharList],
            // теперь charList будет состоять из первичных 9 персонажей + еще 9 при нажатии на кнопку load more
            // при этом если первый раз запускается onCharListLoaded то в charList будет пустым массивом а newCharList развернется как элименты
            // в последующих запусках в charList будут старые элименты а в newCharList новые которые пришли от сервера при нажатии load more
            loading: false,
            newItemLoading: false,
            offset: offset + 9, // каждый раз когда приходит успешный ответ от сервера отступ по получение персонажей увеличиваем на 9
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // console.log(this.itemRefs);
        // console.log(this.itemRefs[id]);
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = {'objectFit' : 'unset'}
            }

            return (
                <li 
                    className="char__item"
                    tabIndex={0} // при помощи tabIndex можно поставить ручной фокус даже на дивы и спены
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id)
                        this.focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id)
                            this.focusOnItem(i)
                        }
                    }}>
                        <img src={item.thumbnail} alt="abyss" style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading} // disabled блокирует кнопку
                    style={{'display' : charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
            // <div className="char__list">
            //     <ul className="char__grid">
            //         <li className="char__item">
            //             <img src={abyss} alt="abyss"/>
            //             <div className="char__name">Abyss</div>
            //         </li>
            //         <li className="char__item char__item_selected">
            //             <img src={abyss} alt="abyss"/>
            //             <div className="char__name">Abyss</div>
            //         </li>
            //         <li className="char__item">
            //             <img src={abyss} alt="abyss"/>
            //             <div className="char__name">Abyss</div>
            //         </li>
            //         <li className="char__item">
            //             <img src={abyss} alt="abyss"/>
            //             <div className="char__name">Abyss</div>
            //         </li>
            //         <li className="char__item">
            //             <img src={abyss} alt="abyss"/>
            //             <div className="char__name">Abyss</div>
            //         </li>
            //         <li className="char__item">
            //             <img src={abyss} alt="abyss"/>
            //             <div className="char__name">Abyss</div>
            //         </li>
            //         <li className="char__item">
            //             <img src={abyss} alt="abyss"/>
            //             <div className="char__name">Abyss</div>
            //         </li>
            //         <li className="char__item">
            //             <img src={abyss} alt="abyss"/>
            //             <div className="char__name">Abyss</div>
            //         </li>
            //         <li className="char__item">
            //             <img src={abyss} alt="abyss"/>
            //             <div className="char__name">Abyss</div>
            //         </li>
            //     </ul>
            //     <button className="button button__main button__long">
            //         <div className="inner">load more</div>
            //     </button>
            // </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;