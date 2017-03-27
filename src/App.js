import React from "react";
import axios from "axios";
import  {PageHeader, Grid, Row, Col, Carousel, Alert} from "react-bootstrap";
import WeatherInfo from "./WeatherInfo";
import Loader from "./Loader";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        const WEATHER_API = "bfc079575bff7ec0b8e4a53770e35ec7";
        const FLICKR_API = "27ae36b8ba016b0092b6cb57722c4008";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                console.info("I've got the position %J", position.coords);
                axios(`http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&lang=es&lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${WEATHER_API}`, {mode: "no-cors"})
                    .then(response => {
                        this.setState({
                            ...this.state,
                            loading: false,
                            position: position.coords,
                            weather_info: response.data
                        });
                    })
                    .catch((error) => {
                        console.warn(error);
                        this.setState({...this.state, loading: false, error});
                    });
                const flickr_url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&per_page=20&format=json&nojsoncallback=1`;

                axios(flickr_url)
                    .then(response => {
                        console.info(response.data);
                        if (response.data.photos && response.data.photos.photo.length > 0) {
                            this.setState({
                                ...this.state,
                                photos: response.data.photos.photo.map(photo => ({
                                    title: photo.title,
                                    url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`
                                }))
                            });
                        } else {
                            this.setState({
                                ...this.state,
                                error: response.data.message
                            });
                        }
                    })
                    .catch(error => {
                        console.warn(error);
                        this.setState({...this.state, loading: false, error});
                    });
            }, failure => {
                console.warn(failure.message);
                this.setState({...this.state, loading: false, error: failure.message});
            });
        } else {
            this.setState({...this.state, error: "position not supported"});
        }
    }

    render() {
        return (<div>
            {this.state.loading && <Loader/>}

            {!this.state.loading && <Grid fluid>
                {this.state.weather_info && <PageHeader> {`Hola, ${this.state.weather_info.city.name}!`} </PageHeader>}
                <Row>
                    {this.state.error && <Col sm={12}><Alert bsStyle="danger">{this.state.error}</Alert></Col>}
                </Row>
                {this.state.weather_info && <Row>
                    {this.state.weather_info.list.map((weather, index) => (
                        <Col sm={index === 0 ? 6 : 3} key={index}>
                            <WeatherInfo weather={weather}/>
                        </Col>
                    ))}
                </Row>}
            </Grid>}

            {(this.state.photos && this.state.photos.length > 0) && <Row>
                <Col sm={6} smOffset={3}>
                    <Carousel>
                        {this.state.photos.map((photo, index) => (
                            <Carousel.Item key={index}>
                                <img width={361} height={267} alt="Carousel" src={photo.url}/>
                                <Carousel.Caption>
                                    <p>{photo.title}</p>
                                </Carousel.Caption>
                            </Carousel.Item>))}
                    </Carousel>
                </Col>
            </Row>}

        </div>);
    }
}

export default App;