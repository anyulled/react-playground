import React from "react";
import axios from "axios";
import {Alert, Carousel, Col, Grid, PageHeader, Row} from "react-bootstrap";
import WeatherInfo from "./WeatherInfo";
import Loader from "./Loader";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        const WEATHER_API = "bfc079575bff7ec0b8e4a53770e35ec7";
        const IMAGE_SEARCH_API = "afdjswhytex6mdk8dvm8aj2s";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                //console.info("I've got the position %J", position.coords);

                axios(`http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&lang=es&lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${WEATHER_API}`, {mode: "no-cors"})
                    .then(response => {
                        this.setState({
                            ...this.state,
                            loading: false,
                            position: position.coords,
                            weather_info: response.data
                        });
                        axios(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&sensor=true`)
                            .then(response => {
                                //console.info(response.data);
                                this.setState({
                                    ...this.state,
                                    city: response.data.results[5].formatted_address
                                });
                                axios(`https://api.gettyimages.com/v3/search/images`, {
                                    headers: {"Api-Key": IMAGE_SEARCH_API},
                                    params: {
                                        orientations: "Horizontal",
                                        phrase: this.state.city,
                                        page_size: 10
                                    }
                                })
                                    .then(response => {
                                        //console.info(response.data);
                                        if (response.data.images && response.data.images.length > 0) {
                                            this.setState({
                                                ...this.state,
                                                photos: response.data.images.map(photo => ({
                                                    title: photo.title,
                                                    description: photo.caption,
                                                    url: photo.display_sizes[0].uri
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
                                        console.warn("Getty Images", error);
                                        this.setState({...this.state, loading: false, error});
                                    });
                            }).catch(error => {
                            console.warn("Google Location error:", error);
                        });
                    })
                    .catch((error) => {
                        console.warn("Geolocation error", error);
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
                {this.state.weather_info && <PageHeader> {`Hola, ${this.state.weather_info.city.name}!`}
                    <small>{this.state.city}</small>
                </PageHeader>}
                <Row>
                    {this.state.error && <Col sm={12}><Alert bsStyle="warning">{this.state.error}</Alert></Col>}
                </Row>
                {this.state.weather_info && <Row>

                    {(this.state.photos && this.state.photos.length > 0) &&
                    <Col sm={6} md={4} lg={2}>
                        <Carousel>
                            {this.state.photos.map((photo, index) => (
                                <Carousel.Item key={index}>
                                    <img width={361} height={267} alt={photo.title} src={photo.url}/>
                                    <Carousel.Caption>
                                        <p>{photo.title}</p>
                                    </Carousel.Caption>
                                </Carousel.Item>))}
                        </Carousel>
                    </Col>
                    }
                    {this.state.weather_info.list.map((weather, index) => (
                        <Col sm={6} md={4} lg={2} key={index}>
                            <WeatherInfo weather={weather}/>
                        </Col>
                    ))}
                </Row>}
            </Grid>}


        </div>);
    }
}

export default App;