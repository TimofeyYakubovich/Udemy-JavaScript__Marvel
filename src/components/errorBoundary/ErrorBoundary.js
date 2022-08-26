import { Component } from "react/cjs/react.production.min";
import ErrorMessage from "../errorMessage/ErrorMessage";

// предохранители ловят далеко не все ошибки 
// они ловят ошибки только при запуске метода render, в методах жизненного цикла и в конструкторах дочерних компанентов

// предохранители не ловят ошибки которые произошли внутри обработчиков событий потому что событие происходит в не метода render
// в асинхронном коде и внутри самого предохранителя

// каждый мелкий простой компанент оборачивать в предохрантель тоже не стоит
// только те каторые скрее всего могут словаться тут на своё усмотрение

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    // static getDerivedStateFromError(error) { 
    //     // метод static getDerivedStateFromError тоже используется в предохранителях наровне с componentDidCatch
    //     // но он только обновляет state
    //     // пофакту он работает только с ошибкой и возвращает новый стейт
    //     // никаких сторонних операций сдесь не должно быть только изменение стейта
    //     return {error: true};
    // }

    componentDidCatch(error, errorInfo) { // хук вызывается тогда когда в компаненте произошла ошибка
        console.log(error, errorInfo);
        this.setState({
            error: true                   // есл произошла ошибка то переводим error в true
        })
    }

    render() {
        if(this.state.error) { // если error: true то рендерим на станицу запасной интерфейс
            // return <h2>Something went wrong</h2> 
            return <ErrorMessage/>
            // теперь также появляется ошибка но если ее закрыть весь отсальной интерфейс остался и работает
            // и сообщения в консоль так же приходят и их можно куда то передать
        }

        // если никакой ошибки нет то будем рендерить то что находится внутри этого компанента (то что оборачивает ErrorBoundary)
        return this.props.children;  // this.props.children это компанент каторый был передан во внутарь этого компанента ErrorBoundary
        // return <ErrorMessage/>;  
    }

}

export default ErrorBoundary;