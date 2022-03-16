// Méthode pour mettre en majuscule le début du mot
const capitalize = s => s && s[0].toUpperCase() + s.slice(1) || "";

// Vérification de si la clé ville du localStorage existe, sinon la créée
if (angular.isUndefined(angular.fromJson(localStorage.villes))) {
    localStorage.villes = "[]";
}

/**
 * Controleur de la page meteovilles
 * Récupère les informations liées aux villes du localStorage
 * Si le localStorage est vide, renvoi vers /villes
 * Initialise également les méthodes clear et remove ainsi que la barre de recherche avec le nom des villes
 *
 * @param $scope objet de liaison avec la vue
 * @param $http permet de faire des requêtes http
 * @param $document[0] permet d'accéder au DOM grâce à AngularJS
 * @param $location permet de faire une redirection
 * @param $log permet d'afficher une potentielle erreur dans la console
 */
angular.module("meteo").controller("meteovilles", ["$scope", "$http", "$document", "$location", "$log", function ($scope, $http, {0: $document}, $location, $log) {
    // Fonction pour mettre à jour les données
    const updateData = () => {
        $scope.villes.forEach(ville => {
            $http.get(`https://api.openweathermap.org/data/2.5/weather?q=${ville.nom},fr&appid=ee07e2bf337034f905cde0bdedae3db8&units=metric&lang=fr`)
                .then(res => {
                    ville.data = {
                        temp: res.data.main.temp,
                        pressure: res.data.main.pressure,
                        humidity: res.data.main.humidity,
                        weatherIcon: `wi wi-owm-${res.data.weather[0].id}`,
                        weather: capitalize(res.data.weather[0].description),
                        wind: res.data.wind.speed,
                        windIcon: `wi wi-wind towards-${res.data.wind.deg}-deg`
                    };
                }).catch(err => $log.error(err));
        });
    };

    // Si le localStorage est vide, renvoi vers /villes
    $scope.villes = angular.fromJson(localStorage.villes);
    if ($scope.villes.length === 0) {
        $location.path("/villes");
    }

    // Initialise la barre de recherche avec le nom des villes
    const data = {};
    $scope.villes.forEach(e => {
        data[e.nom] = null;
    });
    M.Autocomplete.init($document.getElementById("autocomplete-form"), {
        data,
        minLength: 0
    });

    updateData();

    // Fonction pour le bouton clear de la barre de recherche
    $scope.clear = () => {
        const autocomplete = $document.getElementById("autocomplete-form");
        autocomplete.value = "";
        autocomplete.labels[0].classList.remove("active");
        $scope.ville = undefined;
    };

    // Fonction pour la suppression d'une ville
    $scope.remove = (ville => {
        if (ville) {
            const arr = angular.fromJson(localStorage.villes).filter(o => o.nom !== ville);
            // Réindexage des villes en fonction de la position dans la liste
            arr.forEach((v, i) => {
                v.id = i;
            });
            localStorage.villes = angular.toJson(arr);
            $scope.villes = arr;
            updateData();
        }
    });
}]);

/**
 * Controleur de la page previsions
 * Récupère les informations des prévisions liées à la ville choisie en paramètre
 *
 * @param $scope objet de liaison avec la vue
 * @param $http permet de faire des requêtes http
 * @param $routeParams permet d'accéder aux paramètres de la route
 * @param $location permet de faire une redirection
 * @param $log permet d'afficher une potentielle erreur dans la console
 */
angular.module("meteo").controller("previsions", ["$scope", "$http", "$routeParams", "$location", "$log", function ($scope, $http, $routeParams, $location, $log) {
    // Récupération de la ville dont l'id est passé en paramètre
    $scope.ville = angular.fromJson(localStorage.villes).find(elem => elem.id.toString() === $routeParams.villeId);

    // Si une ville a été choisie, requête pour récupérer les informations des prévisions, sinon renvoi vers /
    if (angular.isDefined($scope.ville)) {
        $http.get(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${$scope.ville.nom},fr&cnt=8&appid=ee07e2bf337034f905cde0bdedae3db8&units=metric&lang=fr`)
            .then(res => {
                $scope.ville.data = [];
                res.data.list.forEach((day, i) => {
                    $scope.ville.data.push({
                        id: i,
                        date: capitalize(new Intl.DateTimeFormat("fr-FR", {dateStyle: "full"}).format(new Date(day.dt * 1000))),
                        weatherIcon: `wi wi-owm-${day.weather[0].id}`,
                        weather: capitalize(day.weather[0].description),
                        temp_min: day.temp.min,
                        temp_max: day.temp.max
                    });
                });
            }).catch(err => $log.error(err));
    } else {
        $location.path("/");
    }
}]);

/**
 * Controleur de la page villes
 * Récupère les informations liées aux villes du localStorage
 * Si le localStorage est vide, renvoi vers /villes
 * Initialise également les méthodes clear et remove ainsi que la barre de recherche avec le nom des villes
 *
 * @param $scope objet de liaison avec la vue
 * @param $http permet de faire des requêtes http
 * @param $document[0] permet d'accéder au DOM grâce à AngularJS
 */
angular.module("meteo").controller("villes", ["$scope", "$http", "$document", "$log", function ($scope, $http, {0: $document}) {
    // Affichage du résultat de l'ajout : succès ou échec
    const setText = (color, txt) => {
        const invert = color === "green-text" ? color : "red-text";
        const elem = $document.getElementById("result");
        elem.classList.remove(invert);
        elem.classList.add(color);
        elem.innerText = txt;
    };

    // Fonction vérifiant si une ville existe, ou si elle est déjà dans la liste, sinon elle est ajoutée
    $scope.submit = ville => {
        if (ville) {
            $http.get(`https://api.openweathermap.org/data/2.5/weather?q=${ville},fr&appid=ee07e2bf337034f905cde0bdedae3db8&units=metric&lang=fr`)
                .then(() => {
                    const arr = angular.fromJson(localStorage.villes);
                    if (angular.isUndefined(arr.find(val => val.nom === ville))) {
                        arr[arr.length] = {nom: ville, id: arr.length};
                        localStorage.villes = angular.toJson(arr);
                        setText("green-text", `La ville ${ville} a été ajoutée`);
                    } else {
                        setText("red-text", "Cette ville est déjà dans la liste");
                    }
                }).catch(() => setText("red-text", "Cette ville n'existe pas"));
        } else {
            setText("red-text", "L'entrée est vide");
        }

        // Vidage du champ de texte
        const input = $document.getElementById("ville_form");
        input.value = "";
        input.labels[0].classList.remove("active");
        $scope.ville = undefined;
    };
}]);
