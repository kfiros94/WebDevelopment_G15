const cardsData = {
    categories: {
        Nature: [
            { id: 1, image: "/hebrewCards/sun.jpg", english: "Sun", hebrew: "שֶׁמֶשׁ (Shemesh)" },
            { id: 2, image: "/hebrewCards/tree.jpg", english: "Tree", hebrew: "עֵץ (Etz)" },
            { id: 7, image: "/hebrewCards/flower.jpg", english: "Flower", hebrew: "פֶּרַח (Perach)" },
            { id: 8, image: "/hebrewCards/river.jpg", english: "River", hebrew: "נָהָר (Nahar)" },
            { id: 9, image: "/hebrewCards/mountain.jpg", english: "Mountain", hebrew: "הַר (Har)" },
            { id: 10, image: "/hebrewCards/ocean.jpg", english: "Ocean", hebrew: "יָם (Yam)" },
            { id: 11, image: "/hebrewCards/sky.jpg", english: "Sky", hebrew: "שָׁמַיִם (Shamayim)" },
            { id: 12, image: "/hebrewCards/rain.jpg", english: "Rain", hebrew: "גֶּשֶׁם (Geshem)" },
            { id: 13, image: "/hebrewCards/cloud.jpg", english: "Cloud", hebrew: "עָנָן (Anan)" },
            { id: 14, image: "/hebrewCards/desert.jpg", english: "Desert", hebrew: "מִדְבָּר (Midbar)" },
            { id: 61, image: "/hebrewCards/forest.jpg", english: "Forest", hebrew: "יַעַר (Yaar)" },
            { id: 62, image: "/hebrewCards/flower_field.jpg", english: "Flower Field", hebrew: "שְׂדֵה פְּרָחִים (Sdeh Prachim)" }
        ],
        Animals: [
            { id: 3, image: "/hebrewCards/lion.jpg", english: "Lion", hebrew: "אַריֵה (Arieh)" },
            { id: 4, image: "/hebrewCards/dog.jpg", english: "Dog", hebrew: "כֶּלֶב (Kelev)" },
            { id: 15, image: "/hebrewCards/cat.jpg", english: "Cat", hebrew: "חָתוּל (Chatul)" },
            { id: 16, image: "/hebrewCards/bird.jpg", english: "Bird", hebrew: "צִפּוֹר (Tzipor)" },
            { id: 17, image: "/hebrewCards/fish.jpg", english: "Fish", hebrew: "דָּג (Dag)" },
            { id: 18, image: "/hebrewCards/horse.jpg", english: "Horse", hebrew: "סוּס (Sus)" },
            { id: 19, image: "/hebrewCards/buterfly.png", english: "Butterfly", hebrew: "פַּרְפָּר (Parpar)" },
            { id: 20, image: "/hebrewCards/deer.jpg", english: "Deer", hebrew: "צְבִי (Tzvi)" },
            { id: 21, image: "/hebrewCards/rabbit.jpg", english: "Rabbit", hebrew: "אַרְנָב (Arnav)" },
            { id: 22, image: "/hebrewCards/frog.jpg", english: "Frog", hebrew: "צְפַרְדֵּעַ (Tzfardea)" },
            { id: 63, image: "/hebrewCards/turtle.jpg", english: "Turtle", hebrew: "צָב (Tzav)" },
            { id: 64, image: "/hebrewCards/fox.jpg", english: "Fox", hebrew: "שׁוּעָל (Shual)" }
        ],
        Food: [
            { id: 5, image: "/hebrewCards/apple.jpg", english: "Apple", hebrew: "תַּפּוּחַ (Tapuach)" },
            { id: 6, image: "/hebrewCards/bread.jpg", english: "Bread", hebrew: "לֶחֶם (Lechem)" },
            { id: 23, image: "/hebrewCards/cheese.jpg", english: "Cheese", hebrew: "גְּבִינָה (Gvina)" },
            { id: 24, image: "/hebrewCards/pizza.jpg", english: "Pizza", hebrew: "פִּיצָה (Pizza)" },
            { id: 25, image: "/hebrewCards/orange.jpg", english: "Orange", hebrew: "תַּפּוּז (Tapuz)" },
            { id: 26, image: "/hebrewCards/milk.jpg", english: "Milk", hebrew: "חָלָב (Chalav)" },
            { id: 27, image: "/hebrewCards/cake.jpg", english: "Cake", hebrew: "עוּגָה (Ooga)" },
            { id: 28, image: "/hebrewCards/egg.jpg", english: "Egg", hebrew: "בֵּיצָה (Beitza)" },
            { id: 29, image: "/hebrewCards/rice.jpg", english: "Rice", hebrew: "אוֹרֶז (Orez)" },
            { id: 30, image: "/hebrewCards/chicken.jpg", english: "Chicken", hebrew: "עוֹף (Of)" },
            { id: 65, image: "/hebrewCards/banana.jpg", english: "Banana", hebrew: "בָּנָנָה (Banana)" },
            { id: 66, image: "/hebrewCards/watermelon.jpg", english: "Watermelon", hebrew: "אֲבַטִּיחַ (Avatiach)" }
        ],
        Colors: [
            { id: 31, image: "/hebrewCards/red.jpg", english: "Red", hebrew: "אָדוֹם (Adom)" },
            { id: 32, image: "/hebrewCards/blue.jpg", english: "Blue", hebrew: "כָּחוֹל (Kachol)" },
            { id: 33, image: "/hebrewCards/green.jpg", english: "Green", hebrew: "יָרוֹק (Yarok)" },
            { id: 34, image: "/hebrewCards/yellow.jpg", english: "Yellow", hebrew: "צָהוֹב (Tzahov)" },
            { id: 35, image: "/hebrewCards/black.jpg", english: "Black", hebrew: "שָׁחוֹר (Shachor)" },
            { id: 36, image: "/hebrewCards/white.jpg", english: "White", hebrew: "לָבָן (Lavan)" },
            { id: 37, image: "/hebrewCards/purple.jpg", english: "Purple", hebrew: "סָגוֹל (Sagol)" },
            { id: 38, image: "/hebrewCards/orangeColor.jpg", english: "Orange", hebrew: "כָּתוֹם (Katom)" },
            { id: 39, image: "/hebrewCards/pink.jpg", english: "Pink", hebrew: "וָרוֹד (Varod)" },
            { id: 40, image: "/hebrewCards/brown.jpg", english: "Brown", hebrew: "חוּם (Chum)" },
            { id: 67, image: "/hebrewCards/gold.jpg", english: "Gold", hebrew: "זָהָב (Zahav)" },
            { id: 68, image: "/hebrewCards/silver.jpg", english: "Silver", hebrew: "כֶּסֶף (Kesef)" }
        ],
        Transportation: [
            { id: 41, image: "/hebrewCards/car.jpg", english: "Car", hebrew: "מְכוֹנִית (Mechonit)" },
            { id: 42, image: "/hebrewCards/bicycle.jpg", english: "Bicycle", hebrew: "אוֹפַנּוֹעַ (Ofanayim)" },
            { id: 43, image: "/hebrewCards/train.jpg", english: "Train", hebrew: "רַכֶּבֶת (Rakevet)" },
            { id: 44, image: "/hebrewCards/bus.jpg", english: "Bus", hebrew: "אוֹטוֹבּוּס (Otobus)" },
            { id: 45, image: "/hebrewCards/airplane.jpg", english: "Airplane", hebrew: "מָטוֹס (Matos)" },
            { id: 46, image: "/hebrewCards/boat.jpg", english: "Boat", hebrew: "סִירָה (Sira)" },
            { id: 47, image: "/hebrewCards/helicopter.jpg", english: "Helicopter", hebrew: "מַסּוֹק (Masok)" },
            { id: 48, image: "/hebrewCards/truck.jpg", english: "Truck", hebrew: "מַשָּׁאִית (Mashait)" },
            { id: 49, image: "/hebrewCards/motorcycle.jpg", english: "Motorcycle", hebrew: "אוֹפַנּוֹעַ (Ofano'a)" },
            { id: 50, image: "/hebrewCards/taxi.jpg", english: "Taxi", hebrew: "מוֹנִית (Monit)" },
            { id: 69, image: "/hebrewCards/metro.jpg", english: "Metro", hebrew: "מֶטְרוֹ (Metro)" },
            { id: 70, image: "/hebrewCards/scooter.jpg", english: "Scooter", hebrew: "קוֹרְקִינֵט (Korkinet)" }
        ],
        Household: [
            { id: 51, image: "/hebrewCards/chair.jpg", english: "Chair", hebrew: "כִּסֵּא (Kiseh)" },
            { id: 52, image: "/hebrewCards/table.jpg", english: "Table", hebrew: "שֻׁלְחָן (Shulchan)" },
            { id: 53, image: "/hebrewCards/lamp.jpg", english: "Lamp", hebrew: "מְנוֹרָה (Menorah)" },
            { id: 54, image: "/hebrewCards/bed.jpg", english: "Bed", hebrew: "מִטָּה (Mitah)" },
            { id: 55, image: "/hebrewCards/window.jpg", english: "Window", hebrew: "חַלּוֹן (Chalon)" },
            { id: 56, image: "/hebrewCards/door.jpg", english: "Door", hebrew: "דֶּלֶת (Delet)" },
            { id: 57, image: "/hebrewCards/mirror.jpg", english: "Mirror", hebrew: "מַרְאָה (Mar'ah)" },
            { id: 58, image: "/hebrewCards/couch.jpg", english: "Couch", hebrew: "סַפָּה (Sapa)" },
            { id: 59, image: "/hebrewCards/clock.jpg", english: "Clock", hebrew: "שָׁעוֹן (Sha'on)" },
            { id: 60, image: "/hebrewCards/fridge.jpg", english: "Fridge", hebrew: "מְקָרֵר (Mekarer)" },
            { id: 71, image: "/hebrewCards/oven.jpg", english: "Oven", hebrew: "תַּנוּר (Tanur)" },
            { id: 72, image: "/hebrewCards/shelf.jpg", english: "Shelf", hebrew: "מַדָּף (Madaf)" }
        ],
        Clothing: [
            { id: 73, image: "/hebrewCards/shirt.jpg", english: "Shirt", hebrew: "חוּלְצָה (Chultza)" },
            { id: 74, image: "/hebrewCards/pants.jpg", english: "Pants", hebrew: "מִכְנָסַיִים (Michnasayim)" },
            { id: 75, image: "/hebrewCards/shoes.jpg", english: "Shoes", hebrew: "נַעֲלַיִם (Naalayim)" },
            { id: 76, image: "/hebrewCards/jacket.jpg", english: "Jacket", hebrew: "ז'ָקֵט (Jaket)" },
            { id: 77, image: "/hebrewCards/dress.jpg", english: "Dress", hebrew: "שִׂמְלָה (Simla)" },
            { id: 78, image: "/hebrewCards/socks.jpg", english: "Socks", hebrew: "גַּרְבַּיִם (Garbayim)" },
            { id: 79, image: "/hebrewCards/hat.jpg", english: "Hat", hebrew: "כּוֹבַע (Kova)" },
            { id: 80, image: "/hebrewCards/scarf.jpg", english: "Scarf", hebrew: "צָעִיף (Tzaif)" },
            { id: 81, image: "/hebrewCards/gloves.jpg", english: "Gloves", hebrew: "כְּפָפוֹת (Kfafot)" },
            { id: 82, image: "/hebrewCards/belt.jpg", english: "Belt", hebrew: "חוֹגֵרָה (Chogera)" },
            { id: 83, image: "/hebrewCards/tie.jpg", english: "Tie", hebrew: "עֲנִיבָה (Aniva)" },
            { id: 84, image: "/hebrewCards/sweater.jpg", english: "Sweater", hebrew: "סְוֶודֶר (Sweder)" }
        ]
    }
};

export default cardsData;