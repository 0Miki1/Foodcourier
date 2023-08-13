<?php
    class futar{
        private $email;
        private $online;
        private $vancime;

        public function __construct($email){
            $this->email = $email;
            $this->online = false;
            $this->vancime = false;
        }

        public function getEmail() {
            return $this->email;
        }

        public function getOnline() {
            return $this->online;
        }

        public function setOnline($online){
            $this->online = $online;
        }

        public function getVancime() {
            return $this->vancime;
        }

        public function setVancime($vancime){
            $this->vancime = $vancime;
        }
    }

    class rendeles implements JsonSerializable {
        private $sorszam;
        private $megrendeloNev;
        private $megrendeloTel;
        private $megrendeloVaros;
        private $megrendeloIrsz;
        private $megrendeloUtca;
        private $megrendeloHsz;
        private $megrendeloEmelet;
        private $megrendeloAjto;
        private $megrendeloCsengo;
        private $etteremNev;
        private $etteremLat;
        private $etteremLng;
        private $etteremCim; 
        private $allapot;

        public function __construct($sorszam, $megrendeloNev, $megrendeloTel, $megrendeloVaros, $megrendeloIrsz, $megrendeloUtca, $megrendeloHsz, $megrendeloEmelet, $megrendeloAjto, $megrendeloCsengo, $etteremNev, $etteremLat, $etteremLng, $allapot) {
            $this->sorszam =  $sorszam;
            $this->megrendeloNev = $megrendeloNev;
            $this->megrendeloTel = $megrendeloTel;
            $this->megrendeloVaros = $megrendeloVaros;
            $this->megrendeloIrsz = $megrendeloIrsz;
            $this->megrendeloUtca = $megrendeloUtca;
            $this->megrendeloHsz = $megrendeloHsz;
            $this->megrendeloEmelet = $megrendeloEmelet;
            $this->megrendeloAjto = $megrendeloAjto;
            $this->megrendeloCsengo = $megrendeloCsengo;
            $this->etteremNev = $etteremNev;
            $this->etteremLat = $etteremLat;
            $this->etteremLng = $etteremLng;
            $this->allapot = $allapot;
            $this->etteremCim = $this->getAddressFromLatLng($etteremLat.','. $etteremLng);
        }

        private function getAddressFromLatLng($latlng) {
            $api_endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';

            $params = array(
                'latlng' => $latlng,
                'key' => 'AIzaSyBCvrON5AS4aSRxJcSbnszCA1NUWTGF00U'
            );

            $request_url = $api_endpoint . '?' . http_build_query($params);

            $response = file_get_contents($request_url);

            $data = json_decode($response, true);

            if ($data['status'] === 'OK') {      
                return $data["results"][0]["address_components"][3]["long_name"].' '.$data["results"][0]["address_components"][5]["long_name"].', '.$data["results"][0]["address_components"][1]["long_name"].' '.$data["results"][0]["address_components"][0]["long_name"];
            } else {
                return "";
            }
        }

        public function getSorszam() {
            return $this->sorszam;
        }

        public function getMegrendeloNev() {
            return $this->megrendeloNev;
        }
        
        public function getMegrendeloTel() {
            return $this->megrendeloTel;
        }
        
        public function getMegrendeloVaros() {
            return $this->megrendeloVaros;
        }
        
        public function getMegrendeloIrsz() {
            return $this->megrendeloIrsz;
        }
        
        public function getMegrendeloUtca() {
            return $this->megrendeloUtca;
        }
        
        public function getMegrendeloHsz() {
            return $this->megrendeloHsz;
        }
        
        public function getMegrendeloEmelet() {
            return $this->megrendeloEmelet;
        }
        
        public function getMegrendeloAjto() {
            return $this->megrendeloAjto;
        }
        
        public function getMegrendeloCsengo() {
            return $this->megrendeloCsengo;
        }
        
        public function getEtteremNev() {
            return $this->etteremNev;
        }
        
        public function getEtteremLat() {
            return $this->etteremLat;
        }
        
        public function getEtteremLng() {
            return $this->etteremLng;
        }
        
        public function getEtteremCim() {
            return $this->etteremCim;
        }

        public function getAllapot() {
            return $this->allapot;
        }

        public function setAllapot($allapot){
            $this->allapot = $allapot;
        }

        public function jsonSerialize(){
            return [
                "sorszam" => $this -> getSorszam(),
                "megrendelonev" => $this -> getMegrendeloNev(),
                "rendelotelszam" => $this -> getMegrendeloTel(),
                "varos" => $this -> getMegrendeloVaros(),
                "irsz" => $this -> getMegrendeloIrsz(),
                "utca" => $this -> getMegrendeloUtca(),
                "hsz" => $this -> getMegrendeloHsz(),
                "emelet" => $this -> getMegrendeloEmelet(),
                "ajto" => $this -> getMegrendeloAjto(),
                "csengo" => $this -> getMegrendeloCsengo(),
                "etteremId" => $this -> getEtteremNev(),
                "restpozlat" => $this -> getEtteremLat(),
                "restpozlng" => $this -> getEtteremLng(),
                "etteremcim" => $this -> getEtteremCim(),
                "allapot" => $this -> getAllapot()
            ];
        }   
}

    session_start();

    if (isset($_POST["f"]))
    {
        switch ($_POST["f"])
        {
            case "login":
                login($_POST["email"], $_POST["pw"]);
                break;
            case "checkLogin":
                checkLogin();
                break;
            case "logout":
                logout();
                break;
            case "getprevadds":
                getPrevAdds($_SESSION["futar"]->getEmail());
                break;
            case "profileData":
                SelectProfileData($_SESSION["futar"]->getEmail());
                break;
            case "getAddress":
                if (isset($_SESSION["rendeles"])) {
                    echo json_encode($_SESSION["rendeles"]);
                } else {
                    vaneRendeles();
                }
                break;
            case "location":
                $poz = json_decode($_POST["d"], true);
                updateLocation($poz["lat"], $poz["lng"], $_SESSION["futar"]->getEmail());
                break;
            case "confirmaddress":
                confirmAddress($_SESSION["futar"]->getEmail());
                break;
            case "cimadat":
                if (isset($_SESSION["rendeles"])) {
                    echo json_encode($_SESSION["rendeles"]);
                } else {
                    echo 0;
                }
                break;
            case "pickUpOrder":
                pickUpOrder($_SESSION["futar"]->getEmail());
                break;
            case "deliveryDone":
                deliveryDone($_SESSION["futar"]->getEmail());
                break;
            case "getTetelek":
                getRendelesTetel($_SESSION["rendeles"]->getSorszam());
                break;
            case "testDbconnection":
                testDbconnection();
                break;
            case "selectDataTest":
                selectDataTest();
                break;
            case "pwMod":
                pwMod($_SESSION["futar"]->getEmail(), $_POST["pw"]);
                break;
        }
        
    }

    function login($email, $pw){
        $regexEmail = '/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/';
        $regexPw = '/^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\:;"<>,.?\/])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_\-+={}[\]|\:;"<>,.?\/]{8,32}$/';

        if (preg_match($regexEmail, $email) && preg_match($regexPw, $pw)) {
            $conn = new mysqli("localhost", "root", "", "foodorder");
            $hashPw = hash("sha256", $pw);
    
            if (!$conn->connect_error)
            {
                $conn->set_charset("utf8");
    
                $sql = "SELECT email, jelszo FROM futar WHERE email LIKE ? AND jelszo LIKE ?;";
    
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ss", $email, $hashPw);
                $stmt->execute();
                $reader = $stmt->get_result();
    
                if ($reader->num_rows != 0)
                {
                    $conn->close();
                    online($email);
                } else
                {
                    $conn->close();
                    echo 0;
                }
            } else
            {
                echo 0;
            }
        } else {
            echo 0;
        }
    }

    function online($email){
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error)
        {
        	$conn->set_charset("utf8");

            $sql = "UPDATE futar SET online_e = 1 WHERE email LIKE ?";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $conn->close();

            $_SESSION["futar"] = new futar($email);
            $_SESSION["futar"]->setOnline(true);

            echo 1;
        } else
        {
            echo 0;
        }   
    }

    function checkLogin(){
        if (isset($_SESSION["futar"])){
            $loginstate = $_SESSION["futar"]->getOnline();
            echo json_encode($loginstate);
        } else {
            echo 0;
        }
    }

    function logout(){
        $futarId = $_SESSION["futar"]->getEmail();

        if (vanecime($futarId) == 1) {
            $conn = new mysqli("localhost", "root", "", "foodorder");

            if(!$conn->connect_error) {
                $conn->set_charset("utf8");

                $sql = "UPDATE futar SET online_e = 0 WHERE email LIKE ?";

                $stmt = $conn->prepare($sql);
                $stmt->bind_param("s", $futarId);
                $stmt->execute();

                $conn->close();

                $_SESSION["futar"]->setOnline(false);

                echo 1;
            } else {
                echo 0;
            }
        } elseif (vanecime($futarId) == 2) {
            echo 2;
        } else {
            echo 0;
        }
    }

    function vanecime($futarId) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT id FROM rendeles WHERE futarId LIKE ? AND teljesitett IS NULL LIMIT 1;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $futarId);
            $stmt->execute();
            $reader = $stmt->get_result();

           if ($reader->num_rows == 0) {
                $conn->close();
                return 1;
           } else {
                $conn->close();
                return 2;
           }
        } else {
            return 0;
        }
    }

    function getPrevAdds($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT etterem.nev AS etteremnev, CONCAT(cim.utca, ' ', cim.hazszam) AS vevocim, DATE_FORMAT(rendeles.teljesitett, '%H:%i') AS rendelesteljesitve
            FROM rendeles
                INNER JOIN etterem ON rendeles.etteremId = etterem.nev
                INNER JOIN cim ON cim.id = rendeles.cimId
            WHERE futarId LIKE ? AND Day(rendeles.teljesitett) LIKE Day(CURRENT_DATE);";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $reader = $stmt->get_result();
            $tomb = array();

            while ($row = $reader->fetch_assoc()) {
                $tomb[] = $row;
            }

            $conn->close();
            echo json_encode($tomb);
        }
    }

    function SelectProfileData($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT email AS 'Email', nev AS 'Név', online_e AS 'Online státusz', van_cime AS 'Van-e címe' FROM futar WHERE email LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $reader = $stmt->get_result();
            
            $row = $reader->fetch_assoc();

            $conn->close();

            echo json_encode($row);
        } else {
            echo 0;
        }
    }

    function vaneRendeles() {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT id FROM rendeles WHERE teljesitett IS NULL AND futarId IS NULL;";

            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $conn->close();

                checkCouriers();
            } else {
                $conn->close();

                echo 0;
            }
        }
    }

    function checkCouriers() {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT email FROM futar WHERE online_e LIKE 1 AND van_cime LIKE 0;";

            $result = $conn->query($sql);

            if ($result->num_rows == 1) {
                $conn->close();
                //Ha csak egy futár aktív akkor ő megkapja a soron következő kiszállítandó címet
                echo json_encode(getAddress());
            } elseif($result->num_rows > 1) {
                $conn->close();
                //Ha több mint egy futár van bejelentkezve, akkor annak lesz kiosztva, aki a legközelebb van az étteremehez.
                SelectOnlineFutarok();
            }
        } else {
            echo 0;
        }
    }

    function getAddress() {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) { 
            $conn->set_charset("utf8");

            $sql = "SELECT CONCAT(megrendelo.vezeteknev, ' ', megrendelo.keresztnev) AS 'megrendelonev', megrendelo.telefonszam AS 'rendelotelszam', cim.varos AS 'varos', cim.iranyitoszam AS 'irsz', cim.utca AS 'utca', cim.hazszam AS 'hsz', cim.emelet AS 'emelet', cim.ajto AS 'ajto', cim.kapucsengo AS 'csengo', etteremId, etterem.poz_lat AS 'restpozlat', etterem.poz_lng AS 'restpozlng', rendeles.id AS 'sorszam', rendeles.allapot AS 'allapot'
            FROM rendeles
                INNER JOIN megrendelo ON rendeles.megrendeloId = megrendelo.email
                INNER JOIN cim ON rendeles.cimId = cim.id
                INNER JOIN etterem ON rendeles.etteremId = etterem.nev
            WHERE futarId IS NULL
            LIMIT 1;";

            $result = $conn->query($sql);
            $row = null;
            
            if ($result->num_rows == 1) {
                $row = $result->fetch_assoc();
            } else {
                $row = 0;
            }

            $conn->close();

            return $row;
        } else {
            echo 0;
        }
    }

    function SelectOnlineFutarok() {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT email, CONCAT(poz_lat, ',', poz_lng) AS poz FROM futar WHERE online_e LIKE 1 AND van_cime LIKE 0;";

            $result = $conn->query($sql);
            $t = array();
            $row = null;

            while($row = $result->fetch_assoc()){
                $t[] = $row;
            }

            $conn->close();

            if (cimOsztas($t) == $_SESSION["futar"]->getEmail()) {
                echo json_encode(getAddress());
            } else {
                echo 0;
            }
        } else {
            echo 0;
        }
    }

    function cimOsztas($t) {
        $api_endpoint = 'https://maps.googleapis.com/maps/api/distancematrix/json';

        $futarPoziciok = array();
        $etteremPoz = "";
        if (getAddress() != 0) {
            $etteremLat = getAddress()['restpozlat'];
            $etteremLng = getAddress()['restpozlng'];
            $etteremPoz = $etteremLat.','.$etteremLng;
        }

        //futar poziciok meghatarozasa
        for($i = 0; $i < count($t); $i++) {
            $futarPoziciok[] = $t[$i]['poz'];
        }

        $params = array(
            'origins' => implode('|', $futarPoziciok),
            'destinations' => $etteremPoz,
            'key' => 'AIzaSyBCvrON5AS4aSRxJcSbnszCA1NUWTGF00U'
        );

        $request_url = $api_endpoint . '?' . http_build_query($params);

        $response = file_get_contents($request_url);

        $data = json_decode($response, true);

        if ($data['status'] === 'OK') {
            $distances = array();           
            
            for($i = 0; $i < count($data['rows']); $i++) {
                $distances[] = $data['rows'][$i]['elements'][0]['distance']['value'];
            }

            $minDistance = min($distances);

            $j = 0;
            while ($distances[$j] > $minDistance && $j <= count($distances)) {
                $j++;
            }

            return $t[$j]['email'];
        } else {
            echo 0;
        }
    }

    function updateLocation($lat, $lng, $email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "UPDATE futar SET poz_lat = ?, poz_lng = ? WHERE email LIKE ?";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sss", $lat, $lng, $email);
            $stmt->execute();

            $conn->close();
        }
    }

    function confirmAddress($email){
        $row = getAddress();

        $_SESSION["rendeles"] = new rendeles($row["sorszam"], $row["megrendelonev"], $row["rendelotelszam"], $row["varos"], $row["irsz"], $row["utca"], $row["hsz"], $row["emelet"], $row["ajto"], $row["csengo"], $row["etteremId"], $row["restpozlat"], $row["restpozlng"], $row["allapot"]);
        $_SESSION["rendeles"]->setAllapot("0");

        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "UPDATE rendeles SET futarId = ?, allapot = 0 WHERE futarId IS NULL LIMIT 1; ";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $conn->close();

            updateFutarVanCime($email);
        } else {
            echo 0;
        }
    }

    function updateFutarVanCime($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "UPDATE futar SET van_cime = 1 WHERE futar.email LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $conn->close();

            $_SESSION["futar"]->setVancime(1);

            echo 1;
        } else {
            echo 0;
        }
    }

    function pickUpOrder($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "UPDATE rendeles SET allapot = 1 WHERE rendeles.teljesitett IS NULL AND rendeles.futarId LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $conn->close();

            $_SESSION["rendeles"]->setAllapot("1");

            echo 1;
        } else {    
            echo 0;
        }
    }

    function deliveryDone($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "UPDATE rendeles SET teljesitett = NOW() WHERE rendeles.teljesitett IS NULL AND futarId LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $conn->close();

            unset($_SESSION["rendeles"]);

            updateFutarStatus($email);
        } else {
            echo 0;
        }
    }

    function updateFutarStatus($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");
        
        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "UPDATE futar SET van_cime = 0 WHERE email LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $conn->close();

            $_SESSION["futar"]->setVancime(0);

            echo 1;
        } else {
            echo 0;
        }
    }

    function getRendelesTetel($sorsz) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT tetelId, darab FROM kosar WHERE rendelesId LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $sorsz);
            $stmt->execute();

            $result = $stmt->get_result();
            $rows = array();

            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }

            $conn->close();

            echo json_encode($rows);
        } else {
            echo 0;
        }
    }

    //Unit test methods
    function testDbconnection() {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->close();

            echo 1;
        } else {
            echo 0;
        }
    }

    function selectDataTest() {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT nev FROM etterem WHERE nev LIKE 'Döner Kebab Budapest';";

            $result = $conn->query($sql);

            $conn->close();

            $row = $result->fetch_assoc();

            echo json_encode($row);
        } else {
            echo 0;
        }
    }

    function pwMod($email, $pw) {
        if ($pw != "") {
            $conn = new mysqli("localhost", "root", "", "foodorder");

            if (!$conn->connect_error) {
                $conn->set_charset("utf8");

                $pwSHA256 = hash("sha256", $pw);
                
                $sql = "UPDATE futar SET jelszo = ? WHERE email LIKE ?;";

                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ss", $pwSHA256, $email);
                $stmt->execute();

                $conn->close();

                echo 1;
            }
        } else {
            echo 0;
        }
    }

    exit();
?>