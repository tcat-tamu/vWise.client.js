import { Panel } from './panel';
import { PanelType } from './panel-type';
import { Workspace } from './workspace';
import { WorkspaceRepository } from './repo/workspace-repository';
import { expect } from 'chai';
import * as sinon from 'sinon';

const panelType = new PanelType({
  id: 'test-type',
  typeId: 'hello',
  title: 'Hello, World!',
  description: 'This is a test panel definition.',
  priority: 3,
  contentType: 'application/xml',
  matches: noop,
  initPanelData: noop
});

class DummyWorkspaceRepository extends WorkspaceRepository {
  createWorkspace() {
    return Promise.reject(new Error('I am a dummy repo'));
  }

  saveWorkspace() {
    return Promise.reject(new Error('I am a dummy repo'));
  }

  getWorkspace() {
    return Promise.reject(new Error('I am a dummy repo'));
  }

  createPanel() {
    return Promise.reject(new Error('I am a dummy repo'));
  }

  savePanel() {
    return Promise.reject(new Error('I am a dummy repo'));
  }

  getPanel() {
    return Promise.reject(new Error('I am a dummy repo'));
  }
}

const dummyRepo = new DummyWorkspaceRepository();

const workspace = new Workspace('test-workspace', dummyRepo);

describe('Panel', function () {
  describe('#constructor', function () {
    it('should populate values correctly', function () {
      let panel = new Panel('test', panelType, workspace, noop);
      panel.id.should.equal('test');
      panel.type.should.deep.equal(panelType);
      panel.workspace.should.deep.equal(workspace);
      panel.vprops.should.be.ok;
    });
  });

  describe('#setSize', function () {
    let spy;
    let panel;

    beforeEach(function () {
      spy = sinon.spy();
      panel = new Panel('test', panelType, workspace, spy);
    });

    it('should set the width and height properties', function () {
      let width = 123;
      let height = 456;
      panel.setSize(width, height);
      panel.vprops.should.have.property('width', width);
      panel.vprops.should.have.property('height', height);
    });

    it('should trigger a call to the update handler', function () {
      panel.setSize(123, 456);
      spy.called.should.be.true;
    });
  });

  describe('#getSize', function () {
    let panel = new Panel('test', panelType, workspace, noop);

    it('should get the width and height properties', function () {
      let size = panel.getSize();
      size.should.be.ok;
      size.should.have.property('width', panel.vprops.width);
      size.should.have.property('height', panel.vprops.height);
    });
  });

  describe('#setPosition', function () {
    let spy;
    let panel;

    beforeEach(function () {
      spy = sinon.spy();
      panel = new Panel('test', panelType, workspace, spy);
    });

    it('should set the x and y position properties', function () {
      let xPosition = 123;
      let yPosition = 456;
      panel.setPosition(xPosition, yPosition);
      panel.vprops.should.have.property('xPosition', xPosition);
      panel.vprops.should.have.property('yPosition', yPosition);
    });

    it('should trigger a call to the update handler', function () {
      panel.setPosition(123, 456);
      spy.called.should.be.true;
    });
  });

  describe('#getPosition', function () {
    let panel = new Panel('test', panelType, workspace, noop);

    it('should get the x and y position properties', function () {
      let position = panel.getPosition();
      position.should.be.ok;
      position.should.have.property('x', panel.vprops.xPosition);
      position.should.have.property('y', panel.vprops.yPosition);
    });
  });

  describe('#set', function () {
    let spy;
    let panel;

    beforeEach(function () {
      spy = sinon.spy();
      panel = new Panel('test', panelType, workspace, spy);
    });

    it('should set arbitrary properties', function () {
      let property = 'hello';
      let value = 'world';
      panel.set(property, value);
      expect(panel.vprops[property]).to.equal(value);
    });

    it('should trigger a call to the update handler', function () {
      panel.set('hello', 'world');
      spy.called.should.be.true;
    });
  });

  describe('#setAll', function () {
    let spy;
    let panel;

    beforeEach(function () {
      spy = sinon.spy();
      panel = new Panel('test', panelType, workspace, spy);
    });

    it('should set arbitrary properties', function () {
      let properties = {
        hello: 'world',
        foo: 'bar',
        abc: 123
      };

      panel.setAll(properties);
      panel.vprops.should.have.property('hello', 'world');
      panel.vprops.should.have.property('foo', 'bar');
      panel.vprops.should.have.property('abc', 123);
    });

    it('should trigger a call to the update handler', function () {
      panel.set({
        hello: 'world',
        foo: 'bar',
        abc: 123
      });

      spy.called.should.be.true;
    });
  });

  describe('#get', function () {
    let panel = new Panel('test', panelType, workspace, noop);

    it('should get a properties that were previously set', function () {
      panel.set('hello', 'world');
      panel.setAll({ foo: 'bar', abc: 123});
      panel.get('hello').should.equal('world');
      panel.get('foo').should.equal('bar');
      panel.get('abc').should.equal(123);
    });
  });

  describe('#getAll', function () {
    let panel;

    beforeEach(function () {
      panel = new Panel('test', panelType, workspace, noop);
    });

    it('should return all display properties', function () {
      panel.set('hello', 'world');
      let props = panel.getAll();
      props.should.deep.equal(panel.vprops);
    });

    it('should return a copy of panel.vprops and should not be affected by updates', function () {
      let before = panel.getAll();
      panel.set('hello', 'world');
      let after = panel.getAll();

      before.should.not.have.property('hello');
      after.should.have.property('hello', 'world');
    })
  });

  describe('#serialize', function () {
    let panel = new Panel('test', panelType, workspace, noop);

    it('should return an object that can be serialized into JSON and back', function () {
      let dto0 = panel.serialize();
      let dto1 = JSON.parse(JSON.stringify(dto0));

      dto0.should.be.ok;
      dto0.should.deep.equal(dto1);
    });
  });

  describe('#deserialize', function () {
    it('should repopulate a panel instance with serialized values', function () {
      let panel0 = new Panel('test', panelType, workspace, noop);
      panel0.set('hello', 'world');

      let dto0 = panel0.serialize();
      let dto1 = JSON.parse(JSON.stringify(dto0));

      let panel1 = new Panel(null, panelType, workspace, noop);
      panel1.deserialize(dto1);

      panel0.should.deep.equal(panel1);
    });
  });
});

function noop() {}
