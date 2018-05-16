// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.controller('MapController', function ($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {

    //variaveis
    $scope.locais = [];
    $scope.locais.push({ nome: "Shopping Santa Cruz", lat: -23.5991313, lng: -46.6372429 });
    $scope.locais.push({ nome: "McDonalds Ricardo Jafet", lat: -23.6141317, lng: -46.6277008 });
    $scope.locais.push({ nome: "Metro Praça da Árvore", lat: -23.6105357, lng: -46.6376935 });
    $scope.locais.push({ nome: "Restaurante Veneza", lat: -23.6102467, lng: -46.6368618 });
    $scope.locais.push({ nome: "Bar e Lanches Simonico", lat: -23.6090533, lng: -46.636901 });
    $scope.locais.push({ nome: "Vikks Burger", lat: -23.5865525, lng: -46.616429 });
    $scope.locais.push({ nome: "Internacional Shopping Guarulhos", lat: -23.4886528, lng: -46.5494885 });
    $scope.locais.push({ nome: "Teatro Polytheama", lat: -23.1921783, lng: -46.8811017 });
    $scope.locais.push({ nome: "Escola", lat: -23.5723856, lng: -46.6064022 });
    $scope.distanciaMinima = 400;
    $scope.estaPertoDeAlgumLocal = false;
    $scope.locaisPerto = [];
    $scope.localMaisPerto = {};
    $scope.aindaNaoEscolheuSeFazCheckinOuNao = true;
    $scope.checkinFeito = false;
    $scope.eu = { lat: 0, lng: 0 };
    $scope.posOptions = {}

    //funcoes
    $scope.fazerCheckin = function () {
        $scope.checkinFeito = true;
        $scope.aindaNaoEscolheuSeFazCheckinOuNao = false;
    }

    $scope.naoFazerCheckin = function () {
        $scope.checkinFeito = false;
        $scope.aindaNaoEscolheuSeFazCheckinOuNao = false;
    }

    $scope.atualizarLocalizacao = function (posOptions) {

        $scope.aindaNaoEscolheuSeFazCheckinOuNao = true;
        $scope.checkinFeito = false;

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {

            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            $scope.eu.lat = lat;
            $scope.eu.lng = lng;

            //console.log("---------------------------");

            angular.forEach($scope.locais, function(l, i){
                l.distancia = measure(lat, lng, l.lat, l.lng);

                //console.log(l.nome + " está a " + l.distancia + " metros daqui");

                if (l.distancia <= $scope.distanciaMinima) {
                    $scope.locaisPerto.push({
                            nome: l.nome,
                            distancia: l.distancia
                        }
                    );
                    $scope.estaPertoDeAlgumLocal = true;
                }
            });

            $scope.locaisPerto.sort(function(a, b){
                if (a.distancia < b.distancia)
                    return -1;
                if (a.distancia > b.distancia)
                    return 1;
                return 0;
            });

            $scope.localMaisPerto = $scope.locaisPerto[0];


            var myLatlng = new google.maps.LatLng(lat, lng);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            var minhaLocalizacao = { lat: lat, lng: lng };

            var marker = new google.maps.Marker({
                position: minhaLocalizacao,
                map: map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                title: 'Teste'
            });
            marker.addListener('click', toggleBounce);

            function toggleBounce() {
                if (marker.getAnimation() !== null) {
                  marker.setAnimation(null);
                } 
                //else { marker.setAnimation(google.maps.Animation.BOUNCE); }
            }

            function measure(lat1, lng1, lat2, lng2){
                var R = 6378.137;
                var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
                var dLon = lng2 * Math.PI / 180 - lng1 * Math.PI / 180;
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c;
                return Math.round(d * 1000);
            }

            $scope.map = map;
            $ionicLoading.hide();

        }, function (err) { $ionicLoading.hide(); console.log(err); });
    }

    $ionicPlatform.ready(function () {

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles">a</ion-spinner><br/>Acquiring location!'
        });

        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };

        $scope.posOptions = posOptions;

        $scope.atualizarLocalizacao(posOptions);

    });
});