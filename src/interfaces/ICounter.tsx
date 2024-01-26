export interface ICounter {
    title: string;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>>;
    count: number;
    subtitle: string;
}