// Configuration d'AngularJS et ajout du plugin ngRoute
angular.module("meteo", ["ngRoute"])
    .config(["$routeProvider", $routeProvider => {
        // Configuration des routes de l'application
        $routeProvider.when("/", {
            templateUrl: "partials/meteovilles.html",
        }).when("/villes", {
            templateUrl: "partials/villes.html"
        }).when("/previsions/:villeId", {
            templateUrl: "partials/previsions.html"
        }).otherwise("/");
    }])

    .config(["$locationProvider", $locationProvider => {
        // Utilisation du mode html5 : suppression du #! sur les liens
        $locationProvider.html5Mode({
            enabled: true, requireBase: true, rewriteLinks: true
        });
    }])

    .run(["$rootScope", "$document", ($rootScope, {0: $document}) => {
        // À chaque changement de vue, activation du tag active sur la barre de navigation
        // et initialisation de la barre de navigation mobile
        $rootScope.$on("$routeChangeSuccess", (_, curr) => {
            $document.querySelectorAll(".active").forEach(elem => elem.classList.remove("active"));
            const routeId = curr.templateUrl.split("partials/")[1].split(".html")[0];
            $document.getElementById(`${routeId}-active`).classList.add("active");
            M.Sidenav.init($document.getElementById("nav-mobile"));
        });
    }]);
