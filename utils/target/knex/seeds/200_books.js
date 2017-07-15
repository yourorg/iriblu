/*
*/
exports.seed = function (knex, Promise) {
  return Promise.join(

    knex('book').del(),

    //  Generated from https://www.mockaroo.com/schemas/53827
    /* eslint-disable max-len */
    knex('book').insert({deleted: false, title: 'El Caso de los Muertos de Risa',content: 'El acaecimiento misterioso.El papel mortal. Complicaciones. La hipótesis del virus. Amor y venenos. La formúla del amor. Al borde del abismo. Cuando la verdad aturde. Un clavo saca a otro. Un ramito de locura.',pages: 210,authorId: 1}),
    knex('book').insert({deleted: false, title: 'Business Systems Development Analyst',content: 'Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.',pages: 496,authorId: 6}),
    knex('book').insert({deleted: false, title: 'Office Assistant III',content: 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.',pages: 679,authorId: 1}),
    knex('book').insert({deleted: false, title: 'Staff Accountant IV',content: 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.',pages: 853,authorId: 3}),
    knex('book').insert({deleted: false, title: 'Office Assistant II',content: 'Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.\n\nMauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.',pages: 822,authorId: 3}),
    knex('book').insert({deleted: false, title: 'The Galapagos Agenda',content: 'MAX VILLALOBOS is the gifted son of a corporate tycoon. His dream is to make it on his own, even if that means going against his powerful father who has far different plans when it comes to Max’s future..',pages: 373,authorId: 1}),
    knex('book').insert({deleted: false, title: 'Graphic Designer',content: 'Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.\n\nVestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.\n\nIn congue. Etiam justo. Etiam pretium iaculis justo.',pages: 449,authorId: 8}),
    knex('book').insert({deleted: false, title: 'Cotopaxi: Alerta Roja',content: 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.',pages: 290,authorId: 1}),
    knex('book').insert({deleted: false, title: 'A World out of Time',content: 'Phasellus in felis. Donec semper sapien a libero. Nam dui.\n\nProin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.\n\nInteger ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.',pages: 937,authorId: 5}),
    knex('book').insert({deleted: false, title: 'Tau Zero',content: 'Tau Zero sets the scientific realities of space travel in dramatic tension with the no-less-real emotional and psychological states of the travelers. This is a dynamic Anderson explores with great success over the course of the novel as fifty crewmembers settle in for the long journey together. They are a highly-trained team of scientists and researchers, but they are also a community of individuals, each trying to make a life for him or herself in space.',pages: 190,authorId: 7})
    /* eslint-enable max-len */

  );
};
