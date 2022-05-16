import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-color',
  templateUrl: './show-color.component.html',
  styleUrls: ['./show-color.component.scss'],
})
export class ShowColorComponent implements OnInit {


  colorList = [{'name':'negro','value':'black'},{'name':'plata','value':'silver'},{'name':'gris','value':'gray'},{'name':'blanco','value':'white'},{'name':'marron','value':'maroon'},{'name':'rojo','value':'red'},{'name':'púrpura','value':'purple'},{'name':'fucsia','value':'fuchsia'},{'name':'verde','value':'green'},{'name':'Lima','value':'lime'},{'name':'aceituna','value':'olive'},{'name':'amarillo','value':'yellow'},{'name':'Armada','value':'navy'},
    {'name':'azul','value':'blue'},{'name':'verde azulado','value':'teal'},{'name':'agua','value':'aqua'},{'name':'Alice azul','value':'aliceblue'},{'name':'blanco antiguo','value':'antiquewhite'},{'name':'aguamarina','value':'aquamarine'},
    {'name':'azur','value':'azure'},{'name':'beige','value':'beige'},{'name':'sopa de mariscos','value':'bisque'},{'name':'blanchedalmond','value':'blanchedalmond'},{'name':'Violeta Azul','value':'blueviolet'},{'name':'marrón','value':'brown'},{'name':'burlywood','value':'burlywood'},{'name':'cadete azul','value':'cadetblue'},{'name':'monasterio','value':'chartreuse'},{'name':'chocolate','value':'chocolate'},{'name':'coral','value':'coral'},{'name':'azul aciano','value':'cornflowerblue'},{'name':'seda de maiz','value':'cornsilk'},{'name':'carmesí','value':'crimson'},{'name':'cian','value':'cyan'},{'name':'azul oscuro','value':'darkblue'},{'name':'cian oscuro','value':'darkcyan'},{'name':'varilla de oro oscura','value':'darkgoldenrod'},{'name':'gris oscuro','value':'darkgray'},{'name':'verde oscuro','value':'darkgreen'},{'name':'gris oscuro','value':'darkgrey'},{'name':'caqui oscuro','value':'darkkhaki'},{'name':'darkmagenta','value':'darkmagenta'},{'name':'verde oliva oscuro','value':'darkolivegreen'},{'name':'naranja oscuro','value':'darkorange'},{'name':'orquídea oscura','value':'darkorchid'},{'name':'rojo oscuro','value':'darkred'},{'name':'salmón oscuro','value':'darksalmon'},{'name':'verde oscuro','value':'darkseagreen'},{'name':'azul oscuro','value':'darkslateblue'},{'name':'gris oscuro','value':'darkslategray'},
    {'name':'darkslategrey','value':'darkslategrey'},
    {'name':'turquesa oscuro','value':'darkturquoise'},{'name':'Violeta oscuro','value':'darkviolet'},{'name':'Rosa profundo','value':'deeppink'},{'name':'Depskyblue','value':'deepskyblue'},{'name':'dimgray','value':'dimgray'},{'name':'dimgrey','value':'dimgrey'},{'name':'dodgerblue','value':'dodgerblue'},{'name':'ladrillo refractario','value':'firebrick'},{'name':'floral blanco','value':'floralwhite'},{'name':'bosque verde','value':'forestgreen'},{'name':'Gainsboro','value':'gainsboro'},{'name':'fantasma blanco','value':'ghostwhite'},{'name':'oro','value':'gold'},{'name':'vara de oro','value':'goldenrod'},{'name':'verde amarillo','value':'greenyellow'},{'name':'gris','value':'grey'},{'name':'gotas de miel','value':'honeydew'},{'name':'Rosa caliente','value':'hotpink'},
    {'name':'indio rojo','value':'indianred'},{'name':'índigo','value':'indigo'},{'name':'Marfil','value':'ivory'},{'name':'caqui','value':'khaki'},{'name':'lavanda','value':'lavender'},{'name':'lavanda rubor','value':'lavenderblush'},{'name':'verde césped','value':'lawngreen'},{'name':'gasa de limón','value':'lemonchiffon'},{'name':'azul claro','value':'lightblue'},{'name':'coral claro','value':'lightcoral'},{'name':'cian claro','value':'lightcyan'},{'name':'dorado claro','value':'lightgoldenrodyellow'},{'name':'gris claro','value':'lightgray'},{'name':'verde claro','value':'lightgreen'},{'name':'gris claro','value':'lightgrey'},{'name':'Rosa claro','value':'lightpink'},{'name':'salmón ligero','value':'lightsalmon'},{'name':'verde claro','value':'lightseagreen'},{'name':'cielo azul claro','value':'lightskyblue'},{'name':'luces grises','value':'lightslategray'},{'name':'luces grises','value':'lightslategrey'},{'name':'azul claro','value':'lightsteelblue'},{'name':'amarillo claro','value':'lightyellow'},{'name':'verde lima','value':'limegreen'},{'name':'lino','value':'linen'},{'name':'magenta','value':'magenta'},{'name':'mediumaquamarine','value':'mediumaquamarine'},{'name':'azul medio','value':'mediumblue'},{'name':'orquídea mediana','value':'mediumorchid'},{'name':'mediumpurple','value':'mediumpurple'},{'name':'medio verde','value':'mediumseagreen'},
    {'name':'medio pizarra azul','value':'mediumslateblue'},{'name':'medio primaveral','value':'mediumspringgreen'},{'name':'medio turquesa','value':'mediumturquoise'},{'name':'medio violeta','value':'mediumvioletred'},{'name':'medianoche azul','value':'midnightblue'},
    {'name':'crema de menta','value':'mintcream'},{'name':'mistyrose','value':'mistyrose'},{'name':'mocasín','value':'moccasin'},{'name':'navajowhite','value':'navajowhite'},{'name':'Oldlace','value':'oldlace'},{'name':'verde oliva','value':'olivedrab'},{'name':'naranja','value':'orange'},{'name':'rojo naranja','value':'orangered'},{'name':'orquídea','value':'orchid'},{'name':'varilla de oro pálido','value':'palegoldenrod'},{'name':'Verde pálido','value':'palegreen'},{'name':'paleturquesa','value':'paleturquoise'},{'name':'pálido violeta','value':'palevioletred'},{'name':'papaya','value':'papayawhip'},{'name':'melocotón','value':'peachpuff'},{'name':'Perú','value':'peru'},{'name':'rosado','value':'pink'},{'name':'ciruela','value':'plum'},{'name':'azul pálido','value':'powderblue'},{'name':'rojo','value':'red'},{'name':'marron rosado','value':'rosybrown'},{'name':'azul real','value':'royalblue'},{'name':'silla de montar','value':'saddlebrown'},{'name':'salmón','value':'salmon'},{'name':'marrón arenoso','value':'sandybrown'},{'name':'Mar verde','value':'seagreen'},{'name':'concha','value':'seashell'},{'name':'tierra de siena','value':'sienna'},{'name':'cielo azul','value':'skyblue'},{'name':'pizarra azul','value':'slateblue'},{'name':'gris pizarra','value':'slategray'},{'name':'pizarra gris','value':'slategrey'},{'name':'nieve','value':'snow'},{'name':'primavera verde','value':'springgreen'},{'name':'azul acero','value':'steelblue'},{'name':'broncearse','value':'tan'},{'name':'cardo','value':'thistle'},{'name':'tomate','value':'tomato'},{'name':'turquesa','value':'turquoise'},{'name':'Violeta','value':'violet'},{'name':'trigo','value':'wheat'},{'name':'humo blanco','value':'whitesmoke'},{'name':'amarillo verde','value':'yellowgreen'}
  ];
  
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  setColor(color) {
    //this.attributeSel.value = color.value;
    //this.showColor = false;
    //this.editSave = true;
     this.modalCtrl.dismiss({
      'colorSelected': color
     });
  }

}
