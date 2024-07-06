// tslint:disable
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

import { contacts } from '../../../../utils/mocks/contact/contacts';
import { orgs as organizations } from '../../../../utils/mocks/orgs/orgs';
import { departments } from '../../../../utils/mocks/departments/departments';
import { teams } from '../../../../utils/mocks/teams/teams';

const OrgChart = () => {
  const svgRef = useRef();

  const formattedTree = useMemo(() => {
    type Level = {
      name: string;
      children: Level[];
    };

    // ceo
    const ceoId = organizations[0].leader;
    const ceo = contacts.find((contact) => contact.id === ceoId);

    const teamLeads = teams.map((team) => {
      const teamLead = contacts.find((contact) => contact.id === team.leader);
      const teamMembers = contacts
        .filter((contact) => contact.team === team.id)
        .map((contact) => ({ name: contact.name }));

      return {
        department: teamLead.department,
        name: teamLead.name,
        children: teamMembers,
      };
    });

    const departmentHeads = departments.map((department) => {
      const departmentHead = contacts.find(
        (contact) => contact.id === department.leader
      );
      const departmentTeamLeads = teamLeads.filter(
        (teamLead) => teamLead.department === department.id
      );
      return {
        name: departmentHead.name,
        children: departmentTeamLeads,
      };
    });

    const orgCeo = {
      name: ceo.name,
      children: departmentHeads,
    };

    return orgCeo;

    console.log(orgCeo);

    // // dept heads
    // const level2 : Level = {
    // }

    // // team leads
    // const level3 : Level = {
    //   children
    // }

    // CEO level

    // group the data in a hash table of organizations:
    // const orgs = {};
    // contacts.forEach((contact) => {
    //   if (!orgs[contact.organization]) {
    //     orgs[contact.organization] = [];
    //   }
    //   orgs[contact.organization].push(contact);
    // });

    // // group the data in a hash table of departments:
    // const depts = {};
    // Object.keys(orgs).forEach((org) => {
    //   orgs[org].forEach((contact) => {
    //     if (!depts[contact.department]) {
    //       depts[contact.department] = [];
    //     }
    //     depts[contact.department].push(contact);
    //   });
    // });
    // // add the department hash table to the organization hash table:
    // Object.keys(orgs).forEach((org) => {
    //   orgs[org] = depts;
    // });

    // // group the data in a hash table of teams:
    // const teams = {};
    // Object.keys(orgs).forEach((org) => {
    //   Object.keys(orgs[org]).forEach((dept) => {
    //     orgs[org][dept].forEach((contact) => {
    //       if (!teams[contact.team]) {
    //         teams[contact.team] = [];
    //       }
    //       teams[contact.team].push(contact);
    //     });
    //   });
    // });
    // // add the team hash table to the department hash table:
    // Object.keys(orgs).forEach((org) => {
    //   Object.keys(orgs[org]).forEach((dept) => {
    //     orgs[org][dept] = teams;
    //   });
    // });
    // // update the department hash table to include the team hash table:
    // Object.keys(orgs).forEach((org) => {
    //   orgs[org] = depts;
    // });

    // // finally do the same wth users:
    // const users = {};
    // Object.keys(orgs).forEach((org) => {
    //   Object.keys(orgs[org]).forEach((dept) => {
    //     Object.keys(orgs[org][dept]).forEach((team) => {
    //       orgs[org][dept][team].forEach((contact) => {
    //         if (!users[contact._id]) {
    //           users[contact._id] = contact;
    //         }
    //       });
    //     });
    //   });
    // });
    // // add the user hash table to the team hash table:
    // Object.keys(orgs).forEach((org) => {
    //   Object.keys(orgs[org]).forEach((dept) => {
    //     Object.keys(orgs[org][dept]).forEach((team) => {
    //       orgs[org][dept][team] = users;
    //     });
    //   });
    // });
    // // update the department hash table to include the team hash table:
    // Object.keys(orgs).forEach((org) => {
    //   orgs[org] = depts;
    // });
    // // update the organization hash table to include the department hash table:
    // Object.keys(orgs).forEach((org) => {
    //   orgs[org] = depts;
    // });

    // console.log(orgs);
  }, []);

  useEffect(() => {
    console.log('OrgChart.tsx');
    // Define the hierarchical data for the org chart
    // const treeData = {
    //   name: 'CEO',
    //   children: [
    //     {
    //       name: 'CTO',
    //       children: [{ name: 'Developer' }, { name: 'Tester' }],
    //     },
    //     {
    //       name: 'CFO',
    //       children: [{ name: 'Accountant' }, { name: 'Financial Analyst' }],
    //     },
    //   ],
    // };

    const treeData = formattedTree;

    console.log('formattedTree >>> ', formattedTree);

    // Set up the dimensions and margins for the SVG element
    const margin = { top: 100, right: 90, bottom: 30, left: 90 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const containerWidth = svgRef.current.parentElement.clientWidth;
    const containerHeight = svgRef.current.parentElement.clientHeight;

    console.log('containerWidth >>> ', containerWidth);
    function zoomed(event) {
      svg.attr('transform', event.transform);
    }

    // Create an SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .call(d3.zoom().scaleExtent([0.5, 5]).on('zoom', zoomed))
      .append('g')
      .attr(
        'transform',
        `translate(${containerWidth / 4}, ${containerHeight / 4})`
      );

    // Create a tree layout with the specified size
    const treemap = d3
      .tree()
      .size([height, width])
      .nodeSize([100, 200])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2));

    // Convert the flat data into a hierarchy
    const root = d3.hierarchy(treeData, (d) => d.children);
    root.x0 = height / 2;
    root.y0 = 0;

    // Initialize a counter for assigning unique IDs to nodes
    let i = 0;

    // Function to update the tree structure
    const update = (source) => {
      // Assign the new tree layout to the hierarchy
      const treeData = treemap(root);

      // Get the nodes and links from the tree layout
      const nodes = treeData.descendants();
      const links = treeData.descendants().slice(1);

      // Normalize for fixed-depth
      nodes.forEach((d) => (d.y = d.depth * 180));

      // ****************** Nodes section ***************************

      // Update the nodes
      const node = svg
        .selectAll('g.node')
        .data(nodes, (d) => d.id || (d.id = ++i));

      // Enter any new nodes at the parent's previous position
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
        .on('click', (event, d) => click(event, d));

      // Replace rectangle with NextUI Card component
      nodeEnter
        .append('foreignObject')
        .attr('width', 120)
        .attr('height', 60)
        .attr('x', -60) // Offset to center the card
        .attr('y', -30) // Offset to center the card
        .append('xhtml:div')
        .style('width', '100%')
        .style('height', '100%')
        .html((d) => {
          return `
            <div class="flex justify-center items-center h-full bg-white rounded">
                  <div shadow className="w-full ">
                  <div>
                      <h4 class="text-center text-black">${d.data.name}</h4>
                  </div>
                  </div>
              </div>
          `;
        });

      // Update the node positions
      const nodeUpdate = nodeEnter.merge(node);

      nodeUpdate
        .transition()
        .duration(750)
        .attr('transform', (d) => `translate(${d.y},${d.x})`);

      // Update the node attributes and style
      nodeUpdate
        .select('rect')
        .attr('width', 100)
        .attr('height', 40)
        .attr('stroke', 'black')
        .attr('stroke-width', 1.5)
        .style('fill', '#fff');

      // Remove any exiting nodes
      const nodeExit = node
        .exit()
        .transition()
        .duration(750)
        .attr('transform', (d) => `translate(${source.y},${source.x})`)
        .remove();

      nodeExit
        .select('rect')
        .attr('width', 100)
        .attr('height', 40)
        .attr('stroke', 'black')
        .attr('stroke-width', 1.5)
        .style('fill', '#fff');

      // ****************** Links section ***************************

      // Update the links
      const link = svg.selectAll('path.link').data(links, (d) => d.id);

      // Enter any new links at the parent's previous position
      const linkEnter = link
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('stroke', 'white')
        .attr('d', (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });

      // Update the link positions
      linkEnter
        .merge(link)
        .transition()
        .duration(750)
        .attr('d', (d) => diagonal(d, d.parent));

      // Remove any exiting links
      link
        .exit()
        .transition()
        .duration(750)
        .attr('d', (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // Store the old positions for transition
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Function to draw the links
      function diagonal(s, d) {
        return `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`;
      }

      // Toggle children on click
      function click(event, d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
    };

    // Initialize the display to show the org chart
    update(root);
  }, []);

  return (
    <svg
      className=" mr-10 border border-gray-600 rounded-sm"
      ref={svgRef}
    ></svg>
  );
};

export default OrgChart;
